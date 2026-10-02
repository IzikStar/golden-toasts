import { Injectable, ForbiddenException, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Invite } from './entities/invite.entity';
import { Toast } from '../toast/entities/toast.entity';
import { User } from '../user/entities/user.entity';
import { InviteWithUserAndToastDetailsDto } from './dto';
import { handleError } from '../../utils';
import { Op } from 'sequelize';
import { ToastService } from '../toast/toast.service';

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);

  constructor(
    @InjectModel(Invite)
    private readonly inviteModel: typeof Invite,
    @Inject(ToastService)
    private readonly toastService: ToastService
  ) {}

  async getPendingInvitesForUser(
    requestedUserId: User['id'],
    currentUser: User
  ): Promise<Invite[]> {
    if (currentUser.id !== requestedUserId) {
      this.logger.error(
        `Unauthorized access: user ${currentUser.id} (${currentUser.username}) tried to access invites of ${requestedUserId}`
      );
      throw new ForbiddenException('You cannot access invites of this user');
    }

    try {
      const pendingInvites = await this.inviteModel.findAll({
        where: { userId: requestedUserId, isConfirmed: null },
        include: [
          {
            model: Toast,
            as: 'toast',
            required: true,
            where: { dueDate: { [Op.gt]: new Date() } },
            include: [
              {
                model: User,
                as: 'creator',
                required: true,
                attributes: { exclude: ['password'] },
                where: {
                  id: {
                    [Op.ne]: requestedUserId,
                  },
                },
              },
            ],
          },
          {
            model: User,
            as: 'invitee',
            attributes: { exclude: ['password'] },
            required: true,
          },
        ],
      });

      this.logger.log(
        `Found ${pendingInvites.length} pending invites for user ${requestedUserId} (${currentUser.username})`
      );
      return pendingInvites;
    } catch (error) {
      handleError(error, 'cannot get pending invites for user', this.logger);
    }
  }

  async getInvitesSentByUser(
    senderId: User['id'],
    currentUser: User
  ): Promise<InviteWithUserAndToastDetailsDto[]> {
    if (currentUser.id !== senderId) {
      this.logger.error(
        `Unauthorized access: user ${currentUser.id} (${currentUser.username}) tried to get invites of user ${senderId}`
      );
      throw new ForbiddenException('You cannot access invites of this user');
    }

    try {
      const sentInvites = await this.inviteModel.findAll({
        include: [
          {
            model: Toast,
            where: { userId: senderId, dueDate: { [Op.gt]: new Date() } },
            required: true,
            include: [
              {
                model: User,
                as: 'creator',
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
          },
          {
            model: User,
            as: 'invitee',
            attributes: { exclude: ['password'] },
            required: true,
            where: {
              id: {
                [Op.ne]: senderId,
              },
            },
          },
        ],
        order: [['isConfirmed', 'ASC']],
      });

      this.logger.log(
        `Found ${sentInvites.length} sent invites for user ${senderId} (${currentUser.username})`
      );
      return sentInvites;
    } catch (error) {
      handleError(error, 'cannot get invites sent by user', this.logger);
    }
  }

  async getInvitesByRelatedToast(
    toastId: Toast['id'],
    currentUser: User
  ): Promise<InviteWithUserAndToastDetailsDto[]> {
    const relatedToast = await this.toastService.getToastById(toastId);

    if (currentUser.id !== relatedToast.userId && !currentUser.isAdmin) {
      this.logger.error(
        `Unauthorized access: user ${currentUser.id} (${currentUser.username}) tried to get invites for toast of user ${relatedToast.userId}`
      );
      throw new ForbiddenException(
        'You cannot access invites for toast of this user'
      );
    }

    try {
      const relatedInvites = await this.inviteModel.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
            required: true,
          },
        ],
        where: {
          toastId,
        },
      });

      this.logger.log(
        `Found ${relatedInvites.length} related invites for toast ${toastId} (${relatedToast.title})`
      );
      return relatedInvites;
    } catch (error) {
      handleError(error, 'cannot get invites related to toast', this.logger);
    }
  }

  async updateInviteStatus(
    inviteId: Invite['id'],
    currentUser: User,
    isConfirmed: Invite['isConfirmed']
  ): Promise<Invite> {
    try {
      const [affectedCount, [updatedInvite]] = await this.inviteModel.update(
        { isConfirmed },
        {
          where: { id: inviteId, userId: currentUser.id },
          returning: true,
        }
      );

      if (affectedCount === 0) {
        this.logger.error(
          `No invite updated: invite ${inviteId} not found or not allowed for user ${currentUser.id} (${currentUser.username})`
        );
        throw new ForbiddenException('You cannot update this invitation');
      }

      this.logger.log(
        `Invite ${inviteId} updated to ${isConfirmed} by user ${currentUser.id} (${currentUser.username})`
      );
      return updatedInvite;
    } catch (error) {
      handleError(error, 'cannot update invite status', this.logger);
    }
  }

  async createInvite(
    toastId: Toast['id'],
    receiverId: User['id'],
    currentUser: User
  ): Promise<Invite> {
    try {
      const inviteToast = await Toast.findByPk(toastId);

      if (!inviteToast) {
        this.logger.error(`Toast ${toastId} not found`);
        throw new ForbiddenException(`Toast ${toastId} not found`);
      }

      if (inviteToast.userId !== currentUser.id && !currentUser.isAdmin) {
        this.logger.error(
          `User ${currentUser.id} (${
            currentUser.username
          }) is not owner of toast ${toastId} (${
            inviteToast.title || 'no title'
          })`
        );
        throw new ForbiddenException('You can only invite to your own toasts');
      }

      const existingInvite = await this.inviteModel.findOne({
        where: { toastId, userId: receiverId },
      });

      if (existingInvite) {
        this.logger.error(
          `Invite already exists for user ${receiverId} to toast ${toastId} (${
            inviteToast.title || 'no title'
          })`
        );
        throw new ForbiddenException(
          'Invite already exists for this user and toast'
        );
      }

      const newInvite = await this.inviteModel.create({
        toastId,
        userId: receiverId,
      });

      this.logger.log(
        `Invite ${newInvite.id} created from toast ${toastId} (${
          inviteToast.title || 'no title'
        }) to user ${receiverId}`
      );
      return newInvite;
    } catch (error) {
      handleError(error, 'cannot create invite', this.logger);
    }
  }

  async deleteInvite(
    inviteId: Invite['id'],
    currentUser: User
  ): Promise<number> {
    try {
      const inviteToDelete = await this.inviteModel.findByPk(inviteId, {
        include: [Toast],
      });

      if (!inviteToDelete) {
        this.logger.error(`Invite ${inviteId} not found`);
        throw new ForbiddenException('Invite not found');
      }

      const isOwner = inviteToDelete.toast?.userId === currentUser.id;
      const isReceiver = inviteToDelete.userId === currentUser.id;

      if (!isOwner && !isReceiver && !currentUser.isAdmin) {
        this.logger.error(
          `User ${currentUser.id} (${currentUser.username}) not authorized to delete invite ${inviteId}`
        );
        throw new ForbiddenException('You cannot delete this invite');
      }

      const deletedCount = await this.inviteModel.destroy({
        where: { id: inviteId },
      });

      this.logger.log(`Invite ${inviteId} deleted successfully`);
      return deletedCount;
    } catch (error) {
      handleError(error, 'deleteInvite', this.logger);
    }
  }
}
