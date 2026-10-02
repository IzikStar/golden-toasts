import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { AccusationService } from './accusation.service';
import { Accusation } from './entities/accusation.entity';
import { CreateAccusationDto } from './dto';
import {
  expectHttpError,
  makeUser,
  compileTestingModule,
} from '../../testing/fixtures';

describe('AccusationService', () => {
  const reporter = makeUser({
    id: 'reporter',
    username: 'reporter',
    isAdmin: true,
  });
  const otherAdmin = makeUser({
    id: 'admin-2',
    username: 'admin2',
    isAdmin: true,
  });
  const accused = makeUser({ id: 'accused', username: 'accused' });
  const bystander = makeUser({ id: 'bystander', username: 'bystander' });

  let accusationModel: Record<string, jest.Mock>;
  let service: AccusationService;

  beforeEach(async () => {
    accusationModel = {
      findByPk: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      destroy: jest.fn().mockResolvedValue(1),
    };

    const moduleRef = await compileTestingModule([
      AccusationService,
      { provide: getModelToken(Accusation), useValue: accusationModel },
    ]);

    service = moduleRef.get(AccusationService);
  });

  describe('createAccusation', () => {
    const dto: CreateAccusationDto = {
      reporterId: reporter.id,
      accusedUserId: accused.id,
      reason: 'Promised cake, brought none',
    };

    it('creates the accusation in the reporter’s own name', async () => {
      accusationModel.create.mockResolvedValue({ id: 'acc-1', ...dto });

      await expect(service.createAccusation(dto, reporter)).resolves.toEqual(
        expect.objectContaining({ id: 'acc-1' })
      );
      expect(accusationModel.create).toHaveBeenCalledWith(dto);
    });

    it('forbids filing an accusation in someone else’s name', async () => {
      await expectHttpError(
        service.createAccusation(dto, otherAdmin),
        HttpStatus.FORBIDDEN
      );
      expect(accusationModel.create).not.toHaveBeenCalled();
    });
  });

  describe('getAccusationsForUser', () => {
    it.each([
      ['the accused user', accused],
      ['an admin', otherAdmin],
    ])('lets %s see the accusations', async (_who, user) => {
      await service.getAccusationsForUser(accused.id, user);

      expect(accusationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { accusedUserId: accused.id } })
      );
    });

    it("forbids a regular user from reading someone else's accusations", async () => {
      await expectHttpError(
        service.getAccusationsForUser(accused.id, bystander),
        HttpStatus.FORBIDDEN
      );
      expect(accusationModel.findAll).not.toHaveBeenCalled();
    });
  });

  describe('deleteAccusation', () => {
    it('lets the reporter delete an accusation with a written reason', async () => {
      accusationModel.findByPk.mockResolvedValue({
        id: 'acc-1',
        reporterId: reporter.id,
        reason: 'Written reason',
      });

      await expect(service.deleteAccusation('acc-1', reporter)).resolves.toBe(
        1
      );
    });

    it('protects an accusation with a written reason from other users', async () => {
      accusationModel.findByPk.mockResolvedValue({
        id: 'acc-1',
        reporterId: reporter.id,
        reason: 'Written reason',
      });

      await expectHttpError(
        service.deleteAccusation('acc-1', otherAdmin),
        HttpStatus.FORBIDDEN
      );
      expect(accusationModel.destroy).not.toHaveBeenCalled();
    });

    it('lets any (admin) caller delete a toast-linked accusation', async () => {
      accusationModel.findByPk.mockResolvedValue({
        id: 'acc-2',
        reporterId: reporter.id,
        crimeToastId: 'toast-1',
        reason: null,
      });

      await expect(service.deleteAccusation('acc-2', otherAdmin)).resolves.toBe(
        1
      );
      expect(accusationModel.destroy).toHaveBeenCalledWith({
        where: { id: 'acc-2' },
      });
    });

    it('returns 404 for an unknown accusation', async () => {
      accusationModel.findByPk.mockResolvedValue(null);

      await expectHttpError(
        service.deleteAccusation('missing', reporter),
        HttpStatus.NOT_FOUND
      );
    });
  });
});
