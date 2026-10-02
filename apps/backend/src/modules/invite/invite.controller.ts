import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Post,
  Delete,
  Body,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { Invite } from './entities/invite.entity';
import { InviteWithUserAndToastDetailsDto } from './dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Toast } from '../toast/entities/toast.entity';

@Controller('invites')
export class InviteController {
  constructor(
    @Inject(InviteService)
    private readonly inviteService: InviteService
  ) {}

  @Get('receiver/:userId/pending')
  async getPendingInvitesForReceiver(
    @Param('userId') userId: User['id'],
    @CurrentUser() currentUser: User
  ): Promise<Invite[]> {
    return this.inviteService.getPendingInvitesForUser(userId, currentUser);
  }

  @Get('sender/:userId')
  async getSentInvites(
    @Param('userId') userId: User['id'],
    @CurrentUser() currentUser: User
  ): Promise<InviteWithUserAndToastDetailsDto[]> {
    return this.inviteService.getInvitesSentByUser(userId, currentUser);
  }

  @Get('toast/:toastId')
  async getInvitesForRelatedToast(
    @Param('toastId') toastId: Toast['id'],
    @CurrentUser() currentUser: User
  ): Promise<InviteWithUserAndToastDetailsDto[]> {    
    return this.inviteService.getInvitesByRelatedToast(toastId, currentUser);
  }

  @Put(':inviteId')
  async updateInviteStatus(
    @Param('inviteId') inviteId: Invite['id'],
    @CurrentUser() currentUser: User,
    @Body('isConfirmed') isConfirmed: Invite['isConfirmed']
  ): Promise<Invite> {
    return this.inviteService.updateInviteStatus(
      inviteId,
      currentUser,
      isConfirmed
    );
  }

  @Post()
  async createInvite(
    @Body('toastId') toastId: string,
    @Body('receiverId') receiverId: string,
    @CurrentUser() currentUser: User
  ): Promise<Invite> {
    return this.inviteService.createInvite(toastId, receiverId, currentUser);
  }

  @Delete(':inviteId')
  async deleteInvite(
    @Param('inviteId') inviteId: string,
    @CurrentUser() currentUser: User
  ): Promise<{ success: boolean }> {
    await this.inviteService.deleteInvite(inviteId, currentUser);

    return { success: true };
  }
}
