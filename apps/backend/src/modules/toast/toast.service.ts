import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, Op, Sequelize, Transaction } from 'sequelize';
import { Toast } from './entities/toast.entity';
import { CreateToastDto } from './dto';
import { Invite } from '../invite/entities/invite.entity';
import { User } from '../user/entities/user.entity';
import { Accusation } from '../accusation/entities/accusation.entity';
import { EditToastDto } from './dto';
import { calculatePeriod } from '../../utils';
import { CountToastsInPeriodByUsersDto } from '../toast/dto';
import { handleError } from '../../utils';

@Injectable()
export class ToastService {
  private readonly logger = new Logger(ToastService.name);

  constructor(
    @InjectModel(Toast)
    private readonly toastModel: typeof Toast,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async createToast(
    currentUser: User,
    dto: CreateToastDto,
    invitesToCreate: User['id'][],
    transaction?: Transaction
  ): Promise<Toast> {
    this.logger.log(
      `Creating toast for user ${dto.userId} by user ${currentUser.id} (${currentUser.username})`
    );

    if (currentUser.id !== dto.userId && !currentUser.isAdmin) {
      this.logger.error(
        `Forbidden: ${currentUser.id} (${currentUser.username}) tried to create toast for ${dto.userId}`
      );
      throw new ForbiddenException('You cannot create toast for this user');
    }

    try {
      const newToast = await this.toastModel.create(
        {
          ...dto,
          dueDate: new Date(dto.dueDate),
        },
        { transaction }
      );

      if (invitesToCreate.length) {
        const inviteInstances = invitesToCreate.map((userId) => ({
          userId,
          toastId: newToast.id,
        }));

        await Invite.bulkCreate(inviteInstances, { transaction });
      }

      this.logger.log(
        `Toast ${newToast.id} (${newToast.title}) created successfully`
      );

      return newToast;
    } catch (error) {
      throw handleError(error, 'Failed to create toast');
    }
  }

  async getToastById(id: Toast['id']): Promise<Toast> {
    try {
      const toastById = await this.toastModel.findByPk(id);

      if (!toastById) {
        this.logger.error(`Toast ${id} not found`);
        throw new NotFoundException(`Toast with ID ${id} not found`);
      }

      this.logger.log(`Toast ${toastById.id} (${toastById.title}) retrieved`);
      return toastById;
    } catch (error) {
      throw handleError(error, `Failed to retrieve toast ${id}`);
    }
  }

  async getAllToasts(): Promise<Toast[]> {
    try {
      const allToasts = await this.toastModel.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            required: true,
            attributes: {
              exclude: ['password'],
            },
          },
          {
            model: Invite,
            required: false,
            attributes: ['isConfirmed'],
            order: [
              ['isConfirmed', 'ASC'],
              ['invitee.username', 'ASC'],
            ],
            include: [
              {
                model: User,
                as: 'invitee',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
        ],
        order: [['dueDate', 'ASC']],
      });

      this.logger.log(`Retrieved ${allToasts.length} toasts`);
      return allToasts;
    } catch (error) {
      throw handleError(error, 'Failed to retrieve toasts');
    }
  }

  async getFutureToasts(
    userId: User['id'],
    currentUser: User
  ): Promise<Toast[]> {
    if (currentUser.id !== userId) {
      this.logger.error(
        `Forbidden: ${currentUser.id} (${currentUser.username}) tried to access future toasts of ${userId}`
      );
      throw new ForbiddenException('You cannot get toasts for this user');
    }

    try {
      const futureToasts = await this.toastModel.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          [Op.or]: [{ userId }, { '$invites.userId$': userId }],
          isDone: false,
        },
        include: [
          {
            model: Invite,
            as: 'invites',
            required: false,
            attributes: ['id', 'isConfirmed', 'userId'],
            where: {
              userId,
              [Op.or]: [
                { isConfirmed: { [Op.ne]: false } },
                { isConfirmed: { [Op.is]: null } },
              ],
            },
            include: [
              {
                model: Toast,
                as: 'toast',
                required: true,
                where: {
                  userId: {
                    [Op.ne]: userId,
                  },
                },
              },
              {
                model: User,
                as: 'invitee',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
          {
            model: User,
            as: 'creator',
            required: true,
            attributes: { exclude: ['password'] },
          },
        ],
        order: [['dueDate', 'ASC']],
      });

      this.logger.log(
        `Found ${futureToasts.length} future toasts for ${userId}`
      );
      return futureToasts;
    } catch (error) {
      throw handleError(
        error,
        `Failed to retrieve future toasts for ${userId}`
      );
    }
  }

  async getToastsByUserId(id: User['id'], currentUser: User): Promise<Toast[]> {
    if (currentUser.id !== id && !currentUser.isAdmin) {
      this.logger.error(
        `Forbidden: ${currentUser.id} (${currentUser.username}) tried to access toasts of ${id}`
      );
      throw new ForbiddenException('You cannot get toasts for this user');
    }

    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error(`User ${id} not found`);
      throw new NotFoundException(`user with id ${id} not found`);
    }

    try {
      const userToasts = await this.toastModel.findAll({
        where: { userId: id },
        order: [['dueDate', 'ASC']],
        include: [
          {
            model: User,
            as: 'creator',
            required: true,
            attributes: { exclude: ['password'] },
          },
          {
            model: Invite,
            required: false,
            attributes: ['isConfirmed'],
            order: [
              ['isConfirmed', 'ASC'],
              ['invitee.username', 'ASC'],
            ],
            include: [
              {
                model: User,
                as: 'invitee',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
        ],
      });

      this.logger.log(
        `Found ${userToasts.length} toasts for ${id} (${user.username})`
      );
      return userToasts;
    } catch (error) {
      throw handleError(error, `Failed to retrieve toasts for user ${id}`);
    }
  }

  async getToastsWaitingForApproval(): Promise<Toast[]> {
    try {
      const pendingToasts = await this.toastModel.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          isDone: false,
          '$accusation.id$': null,
        },
        include: [
          {
            model: Accusation,
            required: false,
            attributes: [],
          },
          {
            model: User,
            as: 'creator',
            required: true,
            attributes: { exclude: ['password'] },
          },
          {
            model: Invite,
            as: 'invites',
            required: false,
            attributes: ['isConfirmed'],
            order: [
              ['isConfirmed', 'ASC'],
              ['invitee.username', 'ASC'],
            ],
            include: [
              {
                model: User,
                as: 'invitee',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
        ],
        order: [['dueDate', 'ASC']],
      });

      this.logger.log(`Found ${pendingToasts.length} unapproved toasts`);
      return pendingToasts;
    } catch (error) {
      throw handleError(error, 'Failed to retrieve toasts for approval');
    }
  }

  async deleteToast(id: Toast['id'], currentUser: User): Promise<number> {
    const toast = await this.getToastById(id);

    const unauthorized =
      (currentUser.id !== toast.userId || toast.dueDate < new Date()) &&
      !currentUser.isAdmin;

    if (unauthorized) {
      this.logger.error(
        `Forbidden: ${currentUser.id} (${currentUser.username}) tried to delete toast ${id} (${toast.title})`
      );
      throw new ForbiddenException('You cannot delete this toast');
    }

    try {
      await Invite.destroy({ where: { toastId: id } });
      await Accusation.destroy({ where: { crimeToastId: id } });

      const rowsAffected = await this.toastModel.destroy({ where: { id } });

      if (rowsAffected === 0) {
        this.logger.error(`Toast ${id} not found for deletion`);
        throw new NotFoundException(`Toast with ID ${id} not found`);
      }

      this.logger.log(`Deleted toast ${id} (${toast.title}) and its invites`);
      return rowsAffected;
    } catch (error) {
      throw handleError(error, `Failed to delete toast ${id}`);
    }
  }

  async editToast(
    toastIdToEdit: string,
    editor: User,
    dto: EditToastDto
  ): Promise<{ toast: Toast }> {
    const toastToEdit = await this.getToastById(toastIdToEdit);

    const isSelf = editor.id === toastToEdit.userId;
    const isAdmin = editor.isAdmin;

    if ((!isSelf || toastToEdit.dueDate < new Date()) && !isAdmin) {
      this.logger.error(
        `Forbidden: ${editor.id} (${editor.username}) tried to edit toast ${toastIdToEdit} (${toastToEdit.title})`
      );
      throw new ForbiddenException('You cannot edit this toast');
    }

    try {
      const isDateChanged =
        dto.dueDate !== undefined &&
        new Date(dto.dueDate).getTime() !== toastToEdit.dueDate.getTime();

      toastToEdit.title = dto.title ?? toastToEdit.title;
      toastToEdit.reason = dto.reason ?? toastToEdit.reason;
      toastToEdit.foods = dto.foods ?? toastToEdit.foods;
      toastToEdit.drinks = dto.drinks ?? toastToEdit.drinks;
      toastToEdit.location = dto.location ?? toastToEdit.location;
      toastToEdit.customLocation =
        dto.customLocation !== undefined
          ? dto.customLocation
          : toastToEdit.customLocation;
      toastToEdit.dueDate =
        dto.dueDate !== undefined ? new Date(dto.dueDate) : toastToEdit.dueDate;

      if (isAdmin) {
        toastToEdit.isDone =
          dto.isDone !== undefined ? dto.isDone : toastToEdit.isDone;
        toastToEdit.userId =
          dto.userId !== undefined ? dto.userId : toastToEdit.userId;
      }

      await toastToEdit.save();

      if (isDateChanged) {
        await Invite.update(
          { isConfirmed: null },
          {
            where: { toastId: toastIdToEdit },
          }
        );

        this.logger.log(
          `All invites for toast ${toastToEdit.id} reset due to date change`
        );
      }

      this.logger.log(
        `Toast ${toastToEdit.id} (${toastToEdit.title}) updated successfully`
      );
      return { toast: toastToEdit };
    } catch (error) {
      throw handleError(error, `Failed to edit toast ${toastToEdit.id}`);
    }
  }

  async getToastsAmountForCurrentPeriod(
    userId?: User['id']
  ): Promise<number | CountToastsInPeriodByUsersDto> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const isFirstPeriod = currentDate.getMonth() < 6;

      const { periodStart, periodEnd } = calculatePeriod(
        currentYear,
        isFirstPeriod
      );

      if (userId) {
        const userToastsAmount = await this.toastModel.count({
          where: {
            isDone: true,
            dueDate: {
              [Op.between]: [periodStart, periodEnd],
            },
            userId,
          },
        });

        return userToastsAmount;
      } else {
        const usersWithToastsCount = (await this.userModel.findAll({
          include: [
            {
              model: this.toastModel,
              as: 'createdToasts',
              attributes: [],
              required: false,
              on: {
                [Op.and]: [
                  { '$createdToasts.userId$': { [Op.col]: 'User.id' } },
                  { isDone: true },
                  {
                    dueDate: {
                      [Op.between]: [periodStart, periodEnd],
                    },
                  },
                ],
              },
            },
          ],
          attributes: [
            'id',
            'username',
            'isAdmin',
            'isPersonaNonGrata',
            [fn('COUNT', col('createdToasts.id')), 'toastsCount'],
          ],
          group: ['User.id', 'username', 'isAdmin', 'isPersonaNonGrata'],
          raw: true,
          order: [['toastsCount', 'DESC']],
        })) as (User & { toastsCount: number })[];

        const total = usersWithToastsCount.reduce(
          (sum, item) => sum + +item.toastsCount,
          0
        );

        return {
          users: usersWithToastsCount.map((item) => ({
            id: item.id,
            username: item.username,
            isAdmin: item.isAdmin,
            isPersonaNonGrata: item.isPersonaNonGrata,
            toastsCount: +item.toastsCount,
          })),
          total,
        };
      }
    } catch (error) {
      throw handleError(error, 'Failed to calculate current period record');
    }
  }

  async getRecord(): Promise<number> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const isFirstPeriod = now.getMonth() < 6;

      const { periodStart } = calculatePeriod(year, isFirstPeriod);

      const [firstHalfRecord, secondHalfRecord] = await Promise.all([
        this.toastModel.findOne({
          attributes: [
            [fn('COUNT', col('id')), 'count'],
            [fn('DATE_PART', 'year', col('dueDate')), 'year'],
          ],
          where: {
            isDone: true,
            dueDate: { [Op.lt]: periodStart },
            [Op.and]: [
              Sequelize.where(
                fn('DATE_PART', 'month', col('dueDate')),
                'month',
                { [Op.between]: [1, 6] }
              ),
            ],
          },
          group: [fn('DATE_PART', 'year', col('dueDate'))],
          order: [[fn('COUNT', col('id')), 'DESC']],
          raw: true,
        }) as Promise<{ count: number } | null>,
        this.toastModel.findOne({
          attributes: [
            [fn('COUNT', col('id')), 'count'],
            [fn('DATE_PART', 'year', col('dueDate')), 'year'],
          ],
          where: {
            isDone: true,
            dueDate: { [Op.lt]: periodStart },
            [Op.and]: [
              Sequelize.where(
                fn('DATE_PART', 'month', col('dueDate')),
                'month',
                { [Op.between]: [7, 12] }
              ),
            ],
          },
          group: [fn('DATE_PART', 'year', col('dueDate'))],
          order: [[fn('COUNT', col('id')), 'DESC']],
          raw: true,
        }) as Promise<{ count: number } | null>,
      ]);

      const firstHalfCount = firstHalfRecord ? +firstHalfRecord.count : 0;
      const secondHalfCount = secondHalfRecord ? +secondHalfRecord.count : 0;

      const record = Math.max(firstHalfCount, secondHalfCount);

      this.logger.log(`Best record so far is ${record}`);
      return record;
    } catch (error) {
      throw handleError(error, 'Failed to calculate best record');
    }
  }
}
