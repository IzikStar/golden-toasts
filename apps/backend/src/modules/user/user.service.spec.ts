import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { EditUserDto } from './dto';
import {
  expectHttpError,
  makeUser,
  compileTestingModule,
} from '../../testing/fixtures';

/** Mimics a Sequelize transaction, which throws if finished twice. */
const fakeTransaction = () => {
  let finished: string | undefined;
  const finish = (state: string) =>
    jest.fn(async () => {
      if (finished) {
        throw new Error(
          `Transaction cannot be ${state} because it has been finished with state: ${finished}`
        );
      }
      finished = state;
    });

  return { commit: finish('committed'), rollback: finish('rolled back') };
};

describe('UserService', () => {
  let userModel: Record<string, jest.Mock> & { sequelize?: unknown };
  let jwtService: { sign: jest.Mock };
  let service: UserService;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      destroy: jest.fn().mockResolvedValue(1),
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed.jwt.token') };

    const moduleRef = await compileTestingModule([
      UserService,
      { provide: getModelToken(User), useValue: userModel },
      { provide: JwtService, useValue: jwtService },
    ]);

    service = moduleRef.get(UserService);
  });

  describe('createUser', () => {
    it('stores a bcrypt hash, never the plain password, and returns only a token', async () => {
      userModel.create.mockImplementation(async (values) => ({
        id: 'new-id',
        ...values,
      }));

      const result = await service.createUser({
        username: 'carol',
        password: 'Secret123',
      });

      expect(result).toEqual({ accessToken: 'signed.jwt.token' });
      const stored = userModel.create.mock.calls[0][0];
      expect(stored.password).not.toBe('Secret123');
      await expect(bcrypt.compare('Secret123', stored.password)).resolves.toBe(
        true
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'new-id',
        username: 'carol',
      });
    });

    it('rejects a username that is already taken', async () => {
      userModel.findOne.mockResolvedValue(makeUser({ username: 'carol' }));

      await expectHttpError(
        service.createUser({ username: 'carol', password: 'Secret123' }),
        HttpStatus.CONFLICT
      );
      expect(userModel.create).not.toHaveBeenCalled();
    });
  });

  describe('reading users never selects the password column', () => {
    it('getUserById', async () => {
      userModel.findOne.mockResolvedValue(makeUser());

      await service.getUserById('user-1');

      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        attributes: { exclude: ['password'] },
      });
    });

    it('getUserById returns 404 for an unknown id', async () => {
      await expectHttpError(
        service.getUserById('missing'),
        HttpStatus.NOT_FOUND
      );
    });

    it('getAllUsers, sorted by username', async () => {
      await service.getAllUsers();

      expect(userModel.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']],
      });
    });
  });

  describe('getCriminalsWithCrimesCount', () => {
    it('asks for accused users only, most accusations first, without passwords', async () => {
      await service.getCriminalsWithCrimesCount();

      const query = userModel.findAll.mock.calls[0][0];
      expect(query.include[0]).toEqual(
        expect.objectContaining({ as: 'accusationsReceived', required: true })
      );
      expect(query.attributes.exclude).toEqual(['password']);
      expect(query.group).toEqual(['User.id']);
      expect(query.order).toEqual([['accusationCount', 'DESC']]);
    });

    it('converts the COUNT() string from Postgres to a number', async () => {
      const row = (username: string, count: string) => ({
        toJSON: () => ({ id: username, username, isPersonaNonGrata: false }),
        get: (key: string) => (key === 'accusationCount' ? count : undefined),
      });
      userModel.findAll.mockResolvedValue([row('dave', '5'), row('erin', '2')]);

      await expect(service.getCriminalsWithCrimesCount()).resolves.toEqual([
        {
          id: 'dave',
          username: 'dave',
          isPersonaNonGrata: false,
          accusationCount: 5,
        },
        {
          id: 'erin',
          username: 'erin',
          isPersonaNonGrata: false,
          accusationCount: 2,
        },
      ]);
    });
  });

  describe('editUser', () => {
    const self = makeUser({ id: 'u1', username: 'alice' });
    const other = makeUser({ id: 'u2', username: 'bob' });
    const admin = makeUser({ id: 'admin', username: 'admin', isAdmin: true });

    const givenStoredUser = (overrides = {}) => {
      const stored = {
        ...makeUser({ id: 'u1', username: 'alice', ...overrides }),
        save: jest.fn().mockResolvedValue(undefined),
      };
      // getUserById -> findOne by id; later findOne calls check username clashes
      userModel.findOne.mockResolvedValueOnce(stored);
      return stored;
    };

    it('forbids a regular user from editing someone else', async () => {
      await expectHttpError(
        service.editUser('u1', other, { username: 'pwned' } as EditUserDto),
        HttpStatus.FORBIDDEN
      );
    });

    it.each<Partial<EditUserDto>>([
      { isAdmin: true },
      { isPersonaNonGrata: true },
    ])('forbids users from changing their own %p flag', async (flags) => {
      const stored = givenStoredUser();

      await expectHttpError(
        service.editUser('u1', self, flags as EditUserDto),
        HttpStatus.FORBIDDEN
      );
      expect(stored.save).not.toHaveBeenCalled();
    });

    it('rejects renaming to a username that is already taken', async () => {
      givenStoredUser();
      userModel.findOne.mockResolvedValueOnce(other);

      await expectHttpError(
        service.editUser('u1', self, { username: 'bob' } as EditUserDto),
        HttpStatus.BAD_REQUEST
      );
    });

    it('hashes a new password and issues a fresh token', async () => {
      const stored = givenStoredUser();

      const result = await service.editUser('u1', self, {
        password: 'NewSecret1',
      } as EditUserDto);

      await expect(bcrypt.compare('NewSecret1', stored.password)).resolves.toBe(
        true
      );
      expect(stored.save).toHaveBeenCalled();
      expect(result.newToken).toBe('signed.jwt.token');
    });

    it('keeps the admin flag in the fresh token after an admin renames themselves', async () => {
      givenStoredUser({ id: 'admin', username: 'admin', isAdmin: true });

      await service.editUser('admin', admin, {
        username: 'chief',
      } as EditUserDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'admin',
        username: 'chief',
        isAdmin: true,
      });
    });

    it("lets an admin toggle another user's flags", async () => {
      const stored = givenStoredUser();

      const result = await service.editUser('u1', admin, {
        isAdmin: true,
        isPersonaNonGrata: true,
      } as EditUserDto);

      expect(stored.isAdmin).toBe(true);
      expect(stored.isPersonaNonGrata).toBe(true);
      expect(stored.save).toHaveBeenCalled();
      expect(result.newToken).toBeUndefined();
    });

    it.each<Partial<EditUserDto>>([
      { username: 'renamed' },
      { password: 'Secret123' },
    ])(
      "forbids an admin from changing another user's credentials (%p)",
      async (credentials) => {
        const stored = givenStoredUser();

        await expectHttpError(
          service.editUser('u1', admin, credentials as EditUserDto),
          HttpStatus.FORBIDDEN
        );
        expect(stored.save).not.toHaveBeenCalled();
      }
    );
  });

  describe('deleteUser', () => {
    let transaction: ReturnType<typeof fakeTransaction>;
    let relatedDestroy: jest.Mock;

    beforeEach(() => {
      transaction = fakeTransaction();
      relatedDestroy = jest.fn().mockResolvedValue(0);
      userModel.sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
        models: {
          Toast: { destroy: relatedDestroy },
          Invite: { destroy: relatedDestroy },
          Accusation: { destroy: relatedDestroy },
        },
      };
    });

    it('forbids deleting another account', async () => {
      await expectHttpError(
        service.deleteUser('u2', makeUser({ id: 'u1' })),
        HttpStatus.FORBIDDEN
      );
      expect(userModel.destroy).not.toHaveBeenCalled();
    });

    it('deletes the user and their related rows in one transaction', async () => {
      await expect(
        service.deleteUser('u1', makeUser({ id: 'u1' }))
      ).resolves.toBe(1);

      expect(relatedDestroy).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        transaction,
      });
      expect(relatedDestroy).toHaveBeenCalledWith({
        where: { reporterId: 'u1' },
        transaction,
      });
      expect(relatedDestroy).toHaveBeenCalledWith({
        where: { accusedUserId: 'u1' },
        transaction,
      });
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();
    });

    it('rolls back once and returns 404 when the user row is already gone', async () => {
      userModel.destroy.mockResolvedValue(0);

      await expectHttpError(
        service.deleteUser('u1', makeUser({ id: 'u1' })),
        HttpStatus.NOT_FOUND
      );
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });
  });
});
