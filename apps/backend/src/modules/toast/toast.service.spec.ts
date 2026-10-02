import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { ToastService } from './toast.service';
import { Toast } from './entities/toast.entity';
import { User } from '../user/entities/user.entity';
import { Invite } from '../invite/entities/invite.entity';
import { Accusation } from '../accusation/entities/accusation.entity';
import { CreateToastDto, EditToastDto } from './dto';
import {
  daysFromNow,
  expectHttpError,
  makeToast,
  makeUser,
  compileTestingModule,
} from '../../testing/fixtures';

describe('ToastService', () => {
  const host = makeUser({ id: 'host', username: 'host' });
  const stranger = makeUser({ id: 'stranger', username: 'stranger' });
  const admin = makeUser({ id: 'admin', username: 'admin', isAdmin: true });

  let toastModel: Record<string, jest.Mock>;
  let userModel: Record<string, jest.Mock>;
  let service: ToastService;

  beforeEach(async () => {
    toastModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      destroy: jest.fn().mockResolvedValue(1),
      count: jest.fn().mockResolvedValue(0),
      findOne: jest.fn().mockResolvedValue(null),
    };
    userModel = {
      findByPk: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
    };

    const moduleRef = await compileTestingModule([
      ToastService,
      { provide: getModelToken(Toast), useValue: toastModel },
      { provide: getModelToken(User), useValue: userModel },
    ]);

    service = moduleRef.get(ToastService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('createToast', () => {
    const dto = {
      userId: host.id,
      reason: 'New job',
      dueDate: daysFromNow(3),
    } as CreateToastDto;

    it('forbids creating a toast on behalf of another user', async () => {
      await expectHttpError(
        service.createToast(stranger, dto, []),
        HttpStatus.FORBIDDEN
      );
      expect(toastModel.create).not.toHaveBeenCalled();
    });

    it('lets an admin create a toast for another user', async () => {
      toastModel.create.mockResolvedValue(makeToast({ userId: host.id }));

      await expect(service.createToast(admin, dto, [])).resolves.toBeDefined();
    });

    it('creates the toast and its invites in the same transaction', async () => {
      const transaction = {} as Transaction;
      const bulkCreate = jest
        .spyOn(Invite, 'bulkCreate')
        .mockResolvedValue([] as never);
      toastModel.create.mockResolvedValue(makeToast({ id: 'new-toast' }));

      const created = await service.createToast(
        host,
        dto,
        ['guest-1', 'guest-2'],
        transaction
      );

      expect(created.id).toBe('new-toast');
      expect(toastModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: host.id, dueDate: dto.dueDate }),
        { transaction }
      );
      expect(bulkCreate).toHaveBeenCalledWith(
        [
          { userId: 'guest-1', toastId: 'new-toast' },
          { userId: 'guest-2', toastId: 'new-toast' },
        ],
        { transaction }
      );
    });

    it('skips invite creation when nobody is invited', async () => {
      const bulkCreate = jest.spyOn(Invite, 'bulkCreate');
      toastModel.create.mockResolvedValue(makeToast());

      await service.createToast(host, dto, []);

      expect(bulkCreate).not.toHaveBeenCalled();
    });
  });

  describe('getToastById', () => {
    it('returns 404 for an unknown toast', async () => {
      toastModel.findByPk.mockResolvedValue(null);

      await expectHttpError(
        service.getToastById('missing'),
        HttpStatus.NOT_FOUND
      );
    });
  });

  describe('read permissions', () => {
    it("forbids reading another user's upcoming toasts, even for an admin", async () => {
      await expectHttpError(
        service.getFutureToasts(host.id, admin),
        HttpStatus.FORBIDDEN
      );
      expect(toastModel.findAll).not.toHaveBeenCalled();
    });

    it("forbids a regular user from listing another user's toasts", async () => {
      await expectHttpError(
        service.getToastsByUserId(host.id, stranger),
        HttpStatus.FORBIDDEN
      );
    });

    it("lets an admin list another user's toasts", async () => {
      userModel.findByPk.mockResolvedValue(host);
      toastModel.findAll.mockResolvedValue([makeToast()]);

      await expect(
        service.getToastsByUserId(host.id, admin)
      ).resolves.toHaveLength(1);
      expect(toastModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: host.id } })
      );
    });

    it('returns 404 when listing toasts of an unknown user', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expectHttpError(
        service.getToastsByUserId('missing', admin),
        HttpStatus.NOT_FOUND
      );
    });
  });

  describe('deleteToast', () => {
    let destroyInvites: jest.SpyInstance;
    let destroyAccusations: jest.SpyInstance;

    beforeEach(() => {
      destroyInvites = jest.spyOn(Invite, 'destroy').mockResolvedValue(0);
      destroyAccusations = jest
        .spyOn(Accusation, 'destroy')
        .mockResolvedValue(0);
    });

    it('lets the host delete an upcoming toast, with its invites and accusations', async () => {
      toastModel.findByPk.mockResolvedValue(
        makeToast({ id: 't1', userId: host.id, dueDate: daysFromNow(1) })
      );

      await expect(service.deleteToast('t1', host)).resolves.toBe(1);
      expect(destroyInvites).toHaveBeenCalledWith({ where: { toastId: 't1' } });
      expect(destroyAccusations).toHaveBeenCalledWith({
        where: { crimeToastId: 't1' },
      });
      expect(toastModel.destroy).toHaveBeenCalledWith({ where: { id: 't1' } });
    });

    it('forbids the host from deleting a toast whose due date has passed', async () => {
      toastModel.findByPk.mockResolvedValue(
        makeToast({ userId: host.id, dueDate: daysFromNow(-1) })
      );

      await expectHttpError(
        service.deleteToast('t1', host),
        HttpStatus.FORBIDDEN
      );
      expect(toastModel.destroy).not.toHaveBeenCalled();
    });

    it("forbids deleting someone else's toast", async () => {
      toastModel.findByPk.mockResolvedValue(makeToast({ userId: host.id }));

      await expectHttpError(
        service.deleteToast('t1', stranger),
        HttpStatus.FORBIDDEN
      );
    });

    it('lets an admin delete any toast, including past ones', async () => {
      toastModel.findByPk.mockResolvedValue(
        makeToast({ userId: host.id, dueDate: daysFromNow(-30) })
      );

      await expect(service.deleteToast('t1', admin)).resolves.toBe(1);
    });
  });

  describe('editToast', () => {
    let resetInvites: jest.SpyInstance;

    beforeEach(() => {
      resetInvites = jest
        .spyOn(Invite, 'update')
        .mockResolvedValue([0] as never);
    });

    const givenToast = (overrides: Partial<Toast> = {}) => {
      const toast = makeToast({ id: 't1', userId: host.id, ...overrides });
      toastModel.findByPk.mockResolvedValue(toast);
      return toast;
    };

    it("forbids editing someone else's toast", async () => {
      const toast = givenToast();

      await expectHttpError(
        service.editToast('t1', stranger, {
          title: 'Hijacked',
        } as EditToastDto),
        HttpStatus.FORBIDDEN
      );
      expect(toast.save).not.toHaveBeenCalled();
    });

    it('forbids the host from editing after the due date', async () => {
      const toast = givenToast({ dueDate: daysFromNow(-1) });

      await expectHttpError(
        service.editToast('t1', host, { title: 'Too late' } as EditToastDto),
        HttpStatus.FORBIDDEN
      );
      expect(toast.save).not.toHaveBeenCalled();
    });

    it('lets an admin edit after the due date', async () => {
      const toast = givenToast({ dueDate: daysFromNow(-1) });

      await service.editToast('t1', admin, { title: 'Fixed' } as EditToastDto);

      expect(toast.title).toBe('Fixed');
      expect(toast.save).toHaveBeenCalled();
    });

    it('applies the fields that were sent and keeps the rest', async () => {
      const toast = givenToast({ reason: 'Old reason', foods: ['cake'] });

      const { toast: edited } = await service.editToast('t1', host, {
        title: 'New title',
      } as EditToastDto);

      expect(edited.title).toBe('New title');
      expect(edited.reason).toBe('Old reason');
      expect(edited.foods).toEqual(['cake']);
      expect(toast.save).toHaveBeenCalled();
    });

    it('resets every invite to pending when the date changes', async () => {
      givenToast({ dueDate: daysFromNow(5) });
      const newDate = daysFromNow(10);

      const { toast } = await service.editToast('t1', host, {
        dueDate: newDate,
      } as EditToastDto);

      expect(toast.dueDate).toEqual(newDate);
      expect(resetInvites).toHaveBeenCalledWith(
        { isConfirmed: null },
        { where: { toastId: 't1' } }
      );
    });

    it('keeps invite answers when the same date is sent again', async () => {
      const dueDate = daysFromNow(5);
      givenToast({ dueDate });

      await service.editToast('t1', host, {
        dueDate: new Date(dueDate.getTime()),
        title: 'Renamed',
      } as EditToastDto);

      expect(resetInvites).not.toHaveBeenCalled();
    });

    it('keeps invite answers when the date is not part of the edit', async () => {
      givenToast();

      await service.editToast('t1', host, {
        reason: 'New reason',
      } as EditToastDto);

      expect(resetInvites).not.toHaveBeenCalled();
    });

    it('ignores isDone and userId from a regular host', async () => {
      const toast = givenToast({ isDone: false });

      await service.editToast('t1', host, {
        isDone: true,
        userId: stranger.id,
      } as EditToastDto);

      expect(toast.isDone).toBe(false);
      expect(toast.userId).toBe(host.id);
    });

    it('lets an admin mark a toast as done and reassign it', async () => {
      const toast = givenToast({ isDone: false, dueDate: daysFromNow(-1) });

      await service.editToast('t1', admin, {
        isDone: true,
        userId: stranger.id,
      } as EditToastDto);

      expect(toast.isDone).toBe(true);
      expect(toast.userId).toBe(stranger.id);
    });
  });

  describe('getToastsAmountForCurrentPeriod', () => {
    it.each([
      [
        'June 30, late evening',
        new Date(2025, 5, 30, 22, 0),
        new Date(2025, 0, 1),
        new Date(2025, 5, 30, 23, 59, 59, 999),
      ],
      [
        'July 1, just after midnight',
        new Date(2025, 6, 1, 0, 0, 1),
        new Date(2025, 6, 1),
        new Date(2025, 11, 31, 23, 59, 59, 999),
      ],
      [
        'December 31',
        new Date(2025, 11, 31, 12, 0),
        new Date(2025, 6, 1),
        new Date(2025, 11, 31, 23, 59, 59, 999),
      ],
      [
        'January 1 of the next year',
        new Date(2026, 0, 1, 0, 0, 1),
        new Date(2026, 0, 1),
        new Date(2026, 5, 30, 23, 59, 59, 999),
      ],
    ])(
      "counts a user's completed toasts in the current half-year (%s)",
      async (_label, now, expectedStart, expectedEnd) => {
        jest.useFakeTimers({ now });
        toastModel.count.mockResolvedValue(3);

        await expect(
          service.getToastsAmountForCurrentPeriod('user-1')
        ).resolves.toBe(3);
        expect(toastModel.count).toHaveBeenCalledWith({
          where: {
            isDone: true,
            dueDate: { [Op.between]: [expectedStart, expectedEnd] },
            userId: 'user-1',
          },
        });
      }
    );

    it('returns per-user counts as numbers, plus the period total', async () => {
      // Postgres returns COUNT() as a string in raw queries.
      userModel.findAll.mockResolvedValue([
        {
          id: 'a',
          username: 'a',
          isAdmin: false,
          isPersonaNonGrata: false,
          toastsCount: '3',
        },
        {
          id: 'b',
          username: 'b',
          isAdmin: true,
          isPersonaNonGrata: false,
          toastsCount: '0',
        },
      ]);

      const result = await service.getToastsAmountForCurrentPeriod();

      expect(result).toEqual({
        users: [
          {
            id: 'a',
            username: 'a',
            isAdmin: false,
            isPersonaNonGrata: false,
            toastsCount: 3,
          },
          {
            id: 'b',
            username: 'b',
            isAdmin: true,
            isPersonaNonGrata: false,
            toastsCount: 0,
          },
        ],
        total: 3,
      });
    });
  });

  describe('getRecord', () => {
    it('returns the best half-year count across first and second halves', async () => {
      toastModel.findOne
        .mockResolvedValueOnce({ count: '4', year: 2023 })
        .mockResolvedValueOnce({ count: '7', year: 2024 });

      await expect(service.getRecord()).resolves.toBe(7);
    });

    it('returns 0 when no past half-year has completed toasts', async () => {
      toastModel.findOne.mockResolvedValue(null);

      await expect(service.getRecord()).resolves.toBe(0);
    });
  });
});
