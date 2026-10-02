import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Accusation } from './entities/accusation.entity';
import { CreateAccusationDto } from './dto';
import { User } from '../user/entities/user.entity';
import { handleError } from '../../utils';
import { Toast } from '../toast/entities/toast.entity';

@Injectable()
export class AccusationService {
  private readonly logger = new Logger(AccusationService.name);

  constructor(
    @InjectModel(Accusation)
    private readonly accusationModel: typeof Accusation
  ) {}

  async getAccusationById(accusationId: Accusation['id']): Promise<Accusation> {
    try {
      const accusationById = await this.accusationModel.findByPk(accusationId);

      if (!accusationById) {
        this.logger.error(`Accusation ${accusationId} not found`);
        throw new NotFoundException(`Accusation ${accusationId} not found`);
      }

      this.logger.log(`Accusation ${accusationId} retrieved successfully`);
      return accusationById;
    } catch (error) {
      handleError(error, `Cannot get accusation ${accusationId}`, this.logger);
    }
  }

  async getAccusationsForUser(
    accusedUserId: User['id'],
    currentUser: User
  ): Promise<Accusation[]> {
    if (currentUser.id !== accusedUserId && !currentUser.isAdmin) {
      this.logger.error(
        `User ${currentUser.id} (${currentUser.username}) unauthorized to get accusations for user ${accusedUserId}`
      );
      throw new ForbiddenException(
        'You cannot access accusations for this user'
      );
    }

    try {
      const userAccusations = await this.accusationModel.findAll({
        where: { accusedUserId },
        include: [
          {
            model: User,
            as: 'reporter',
            attributes: { exclude: ['password'] },
          },
          {
            model: Toast,
            include: [
              {
                model: User,
                as: 'creator',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
        ],
        order: [['createdAt', 'ASC']],
      });

      this.logger.log(
        `Found ${userAccusations.length} accusations against user ${accusedUserId}`
      );
      return userAccusations;
    } catch (error) {
      handleError(
        error,
        `Cannot get accusations for user ${accusedUserId}`,
        this.logger
      );
    }
  }

  async getAccusationsByReporter(
    reporterId: User['id']
  ): Promise<Accusation[]> {
    try {
      const reporterAccusations = await this.accusationModel.findAll({
        where: { reporterId },
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'accusedUser',
            attributes: { exclude: ['password'] },
          },
        ],
      });

      this.logger.log(
        `Reporter ${reporterId} submitted ${reporterAccusations.length} accusations`
      );
      return reporterAccusations;
    } catch (error) {
      handleError(
        error,
        `Cannot get accusations reported by user ${reporterId}`,
        this.logger
      );
    }
  }

  async createAccusation(
    accusationDto: CreateAccusationDto,
    currentUser: User
  ): Promise<Accusation> {
    if (currentUser.id !== accusationDto.reporterId) {
      this.logger.error(
        `User ${currentUser.id} (${currentUser.username}) tried to report in the name of ${accusationDto.reporterId}`
      );
      throw new ForbiddenException('You cannot report in another user’s name');
    }

    try {
      const newAccusation = await this.accusationModel.create(accusationDto);

      this.logger.log(
        `Accusation ${newAccusation.id} created by user ${currentUser.id} (${currentUser.username})`
      );
      return newAccusation;
    } catch (error) {
      handleError(error, 'Failed to create accusation', this.logger);
    }
  }

  async deleteAccusation(
    accusationId: Accusation['id'],
    currentUser: User
  ): Promise<number> {
    try {
      const accusationToDelete = await this.getAccusationById(accusationId);

      const isReporter = currentUser.id === accusationToDelete.reporterId;
      const isProtected = !!accusationToDelete.reason;

      if (!isReporter && isProtected) {
        this.logger.error(
          `User ${currentUser.id} (${currentUser.username}) is not allowed to delete accusation ${accusationId} with reason`
        );
        throw new ForbiddenException('You cannot delete this accusation');
      }

      const rowsAffected = await this.accusationModel.destroy({
        where: { id: accusationId },
      });

      if (rowsAffected === 0) {
        this.logger.error(`Accusation ${accusationId} not found for deletion`);
        throw new NotFoundException(`Accusation ${accusationId} not found`);
      }

      this.logger.log(`Accusation ${accusationId} deleted successfully`);
      return rowsAffected;
    } catch (error) {
      handleError(
        error,
        `Failed to delete accusation ${accusationId}`,
        this.logger
      );
    }
  }
}
