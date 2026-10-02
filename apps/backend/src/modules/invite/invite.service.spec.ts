import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { InviteService } from './invite.service';
import { Invite } from './entities/invite.entity';
import { Toast } from '../toast/entities/toast.entity';
import { ToastService } from '../toast/toast.service';
import {
  expectHttpError,
  makeToast,
  makeUser,
  compileTestingModule,
} from '../../testing/fixtures';

describe('InviteService', () => {
  const host = makeUser({ id: 'host', username: 'host' });
  const guest = makeUser({ id: 'guest', username: 'guest' });
  const stranger = makeUser({ id: 'stranger', username: 'stranger' });
  const admin = makeUser({ id: 'admin', username: 'admin', isAdmin: true });

  let inviteModel: Record<string, jest.Mock>;
  let toastService: { getToastById: jest.Mock };
  let service: InviteService;

  beforeEach(async () => {
    inviteModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn().mockResolvedValue(1),
    };
    toastService = { getToastById: jest.fn() };

    const moduleRef = await compileTestingModule([
      InviteService,
      { provide: getModelToken(Invite), useValue: inviteModel },
      { provide: ToastService, useValue: toastService },
    ]);

    service = moduleRef.get(InviteService);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('createInvite', () => {
    const givenToast = (toast: Toast | null) =>
      jest.spyOn(Toast, 'findByPk').mockResolvedValue(toast);

    it('lets the host invite someone to their toast', async () => {
      givenToast(makeToast({ id: 't1', userId: host.id }));
      inviteModel.create.mockResolvedValue({ id: 'inv-1' });

      await expect(service.createInvite('t1', guest.id, host)).resolves.toEqual(
        { id: 'inv-1' }
      );
      expect(inviteModel.create).toHaveBeenCalledWith({
        toastId: 't1',
        userId: guest.id,
      });
    });

    it("forbids inviting people to someone else's toast", async () => {
      givenToast(makeToast({ id: 't1', userId: host.id }));

      await expectHttpError(
        service.createInvite('t1', guest.id, stranger),
        HttpStatus.FORBIDDEN
      );
      expect(inviteModel.create).not.toHaveBeenCalled();
    });

    it("lets an admin invite people to anyone's toast", async () => {
      givenToast(makeToast({ id: 't1', userId: host.id }));
      inviteModel.create.mockResolvedValue({ id: 'inv-1' });

      await expect(
        service.createInvite('t1', guest.id, admin)
      ).resolves.toBeDefined();
    });

    it('refuses to invite the same user twice', async () => {
      givenToast(makeToast({ id: 't1', userId: host.id }));
      inviteModel.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.createInvite('t1', guest.id, host)).rejects.toThrow(
        'Invite already exists for this user and toast'
      );
      expect(inviteModel.create).not.toHaveBeenCalled();
    });

    it('rejects an unknown toast (reported as 403, not 404)', async () => {
      givenToast(null);

      await expectHttpError(
        service.createInvite('missing', guest.id, host),
        HttpStatus.FORBIDDEN
      );
    });
  });

  describe('updateInviteStatus', () => {
    it.each([
      ['accept', true],
      ['decline', false],
    ])('lets the invitee %s', async (_action, isConfirmed) => {
      const updated = { id: 'inv-1', isConfirmed };
      inviteModel.update.mockResolvedValue([1, [updated]]);

      await expect(
        service.updateInviteStatus('inv-1', guest, isConfirmed)
      ).resolves.toBe(updated);
      expect(inviteModel.update).toHaveBeenCalledWith(
        { isConfirmed },
        { where: { id: 'inv-1', userId: guest.id }, returning: true }
      );
    });

    it("forbids answering an invite that isn't yours (no row matched)", async () => {
      inviteModel.update.mockResolvedValue([0, []]);

      await expectHttpError(
        service.updateInviteStatus('inv-1', stranger, true),
        HttpStatus.FORBIDDEN
      );
    });
  });

  describe('deleteInvite', () => {
    const givenInvite = () =>
      inviteModel.findByPk.mockResolvedValue({
        id: 'inv-1',
        userId: guest.id,
        toast: { userId: host.id },
      });

    it.each([
      ['the host', host],
      ['the invitee', guest],
      ['an admin', admin],
    ])('lets %s delete the invite', async (_who, user) => {
      givenInvite();

      await expect(service.deleteInvite('inv-1', user)).resolves.toBe(1);
      expect(inviteModel.destroy).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
      });
    });

    it('forbids anyone else', async () => {
      givenInvite();

      await expectHttpError(
        service.deleteInvite('inv-1', stranger),
        HttpStatus.FORBIDDEN
      );
      expect(inviteModel.destroy).not.toHaveBeenCalled();
    });

    it('rejects an unknown invite', async () => {
      inviteModel.findByPk.mockResolvedValue(null);

      await expect(service.deleteInvite('missing', host)).rejects.toThrow(
        'Invite not found'
      );
    });
  });

  describe('listing invites', () => {
    it("forbids reading another user's pending invites", async () => {
      await expectHttpError(
        service.getPendingInvitesForUser(guest.id, stranger),
        HttpStatus.FORBIDDEN
      );
      expect(inviteModel.findAll).not.toHaveBeenCalled();
    });

    it('returns only unanswered invites for the current user', async () => {
      await service.getPendingInvitesForUser(guest.id, guest);

      expect(inviteModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: guest.id, isConfirmed: null },
        })
      );
    });

    it('forbids reading invites sent by another user', async () => {
      await expectHttpError(
        service.getInvitesSentByUser(host.id, stranger),
        HttpStatus.FORBIDDEN
      );
    });

    it("forbids a non-host from listing a toast's invites", async () => {
      toastService.getToastById.mockResolvedValue(
        makeToast({ userId: host.id })
      );

      await expectHttpError(
        service.getInvitesByRelatedToast('t1', guest),
        HttpStatus.FORBIDDEN
      );
    });

    it.each([
      ['the host', host],
      ['an admin', admin],
    ])("lets %s list a toast's invites", async (_who, user) => {
      toastService.getToastById.mockResolvedValue(
        makeToast({ id: 't1', userId: host.id })
      );

      await service.getInvitesByRelatedToast('t1', user);

      expect(inviteModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { toastId: 't1' } })
      );
    });
  });
});
