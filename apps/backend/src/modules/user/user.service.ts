import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { col, fn } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Accusation } from '../accusation/entities/accusation.entity';
import { CreateUserOrLoginDto, CriminalDto, EditUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { handleError } from '../../utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService
  ) {}

  async createUser(
    createUserDto: CreateUserOrLoginDto
  ): Promise<{ accessToken: string }> {
    try {
      const existing = await this.userModel.findOne({
        where: { username: createUserDto.username },
      });
      if (existing) {
        throw new ConflictException('user with this name already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      this.logger.log(`User created: ${newUser.username} (${newUser.id})`);

      const payload = { id: newUser.id, username: newUser.username };
      const token = this.jwtService.sign(payload);

      return { accessToken: token };
    } catch (error) {
      handleError(error, 'Create user failed', this.logger);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const userById = await this.userModel.findOne({
        where: { id },
        attributes: { exclude: ['password'] },
      });

      if (!userById) {
        throw new NotFoundException(`User ${id} not found`);
      }

      this.logger.log(`User fetched: ${userById.username} (${userById.id})`);
      return userById;
    } catch (error) {
      handleError(error, `Fetch user by id ${id} failed`, this.logger);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const userByUsername = await this.userModel.findOne({
        where: { username },
      });

      if (!userByUsername) {
        throw new NotFoundException(`User ${username} not found`);
      }

      this.logger.log(
        `User fetched: ${userByUsername.username} (${userByUsername.id})`
      );
      return userByUsername;
    } catch (error) {
      handleError(
        error,
        `Fetch user by username ${username} failed`,
        this.logger
      );
    }
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      const allUsers = await this.userModel.findAll({
        attributes: { exclude: ['password'] },
        order: [['username', 'ASC']],
      });

      this.logger.log(`All users fetched (${allUsers.length})`);
      return allUsers;
    } catch (error) {
      handleError(error, 'Fetch all users failed', this.logger);
    }
  }

  async getCriminalsWithCrimesCount(): Promise<CriminalDto[]> {
    try {
      const criminals = await this.userModel.findAll({
        include: [
          {
            model: Accusation,
            as: 'accusationsReceived',
            required: true,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [fn('COUNT', col('accusationsReceived.id')), 'accusationCount'],
            'username',
            'isPersonaNonGrata',
          ],
          exclude: ['password'],
        },
        group: ['User.id'],
        order: [['accusationCount', 'DESC']],
      });

      this.logger.log(`Criminals fetched (${criminals.length})`);
      return criminals.map((user) => ({
        ...user.toJSON(),
        accusationCount: +(user.get('accusationCount') as string),
      }));
    } catch (error) {
      handleError(error, 'Fetch criminals failed', this.logger);
    }
  }

  async deleteUser(id: User['id'], currentUser: User): Promise<number> {
    if (currentUser.id !== id) {
      throw new ForbiddenException('You cannot delete this user');
    }

    if (!this.userModel.sequelize) {
      throw new Error('Sequelize instance is not initialized');
    }
    const transaction = await this.userModel.sequelize.transaction();

    try {
      const sequelize = this.userModel.sequelize;
      await sequelize.models.Toast.destroy({
        where: { userId: id },
        transaction,
      });
      await sequelize.models.Invite.destroy({
        where: { userId: id },
        transaction,
      });
      await sequelize.models.Accusation.destroy({
        where: { reporterId: id },
        transaction,
      });
      await sequelize.models.Accusation.destroy({
        where: { accusedUserId: id },
        transaction,
      });
      const rowsAffected = await this.userModel.destroy({
        where: { id },
        transaction,
      });

      if (rowsAffected === 0) {
        // The catch block below rolls the transaction back.
        throw new NotFoundException(`User ${id} not found`);
      }
      await transaction.commit();

      this.logger.log(
        `User deleted: ${currentUser.username} (${currentUser.id})`
      );

      return rowsAffected;
    } catch (error) {
      await transaction.rollback();
      handleError(error, `Delete user ${id} failed`, this.logger);
    }
  }

  async editUser(
    userIdToEdit: string,
    editor: User,
    dto: EditUserDto
  ): Promise<{ user: User; newToken?: string }> {
    if (editor.id !== userIdToEdit && !editor.isAdmin) {
      throw new ForbiddenException('You cannot edit this user');
    }

    try {
      const userToEdit = await this.getUserById(userIdToEdit);

      if (editor.id === userIdToEdit) {
        if (dto.isAdmin || dto.isPersonaNonGrata) {
          throw new ForbiddenException('You cannot edit those details');
        }

        if (dto.username) {
          const exists = await this.userModel.findOne({
            where: { username: dto.username },
          });
          if (exists) {
            throw new BadRequestException('user with this name already exists');
          }
          userToEdit.username = dto.username;
        }

        if (dto.password) {
          userToEdit.password = await bcrypt.hash(dto.password, 10);
        }
      }

      if (editor.isAdmin && editor.id !== userIdToEdit) {
        if (dto.username || dto.password) {
          throw new ForbiddenException('You cannot edit those details');
        }
        if (dto.isAdmin !== undefined) userToEdit.isAdmin = dto.isAdmin;
        if (dto.isPersonaNonGrata !== undefined)
          userToEdit.isPersonaNonGrata = dto.isPersonaNonGrata;
      }

      await userToEdit.save();
      this.logger.log(
        `User updated: ${userToEdit.username} (${userToEdit.id})`
      );

      if (editor.id === userIdToEdit && (dto.username || dto.password)) {
        const payload = {
          id: userToEdit.id,
          username: userToEdit.username,
          isAdmin: userToEdit.isAdmin,
        };
        const token = this.jwtService.sign(payload);
        return { user: userToEdit, newToken: token };
      }

      return { user: userToEdit };
    } catch (error) {
      handleError(error, `Edit user ${userIdToEdit} failed`, this.logger);
    }
  }
}
