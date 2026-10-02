import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ToastService } from './toast.service';
import { Toast } from './entities/toast.entity';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsAdmin } from '../auth/decorators/is-admin.decorator';
import { EditToastDto } from './dto';
import { CountToastsInPeriodByUsersDto } from './dto';
import { CreateToastWithInvitesDto } from './dto/create-toast-with-invites.dto';

@Controller('toasts')
export class ToastController {
  constructor(
    @Inject(ToastService)
    private readonly toastService: ToastService
  ) {}

  @Post()
  async createToast(
    @Body() body: CreateToastWithInvitesDto,
    @CurrentUser() currentUser: User
  ): Promise<Toast> {
    const { toast, invites } = body;

    const newToast = await this.toastService.createToast(
      currentUser,
      toast,
      invites
    );

    return newToast;
  }

  @IsAdmin()
  @Get()
  async getAllToasts(): Promise<Toast[]> {
    const allToasts = await this.toastService.getAllToasts();

    return allToasts;
  }

  @Get('future-toasts/:userId')
  async getFutureToasts(
    @Param('userId') userId: User['id'],
    @CurrentUser() currentUser: User
  ): Promise<Toast[]> {
    const futureToasts = await this.toastService.getFutureToasts(
      userId,
      currentUser
    );

    return futureToasts;
  }

  @IsAdmin()
  @Get('waiting-for-approval')
  async getWaitingForApproval(): Promise<Toast[]> {
    const pendingToasts = await this.toastService.getToastsWaitingForApproval();

    return pendingToasts;
  }

  @Get('current-period-toasts-amount')
  async getCurrentPeriodToastsAmount(): Promise<
    number | CountToastsInPeriodByUsersDto
  > {
    const currentPeriodToastsAmount =
      await this.toastService.getToastsAmountForCurrentPeriod();

    return currentPeriodToastsAmount;
  }

  @Get('record')
  async getRecord(): Promise<number> {
    const record = await this.toastService.getRecord();

    return record;
  }

  @Get(':id')
  async getToastByUserId(
    @Param('id') id: User['id'],
    @CurrentUser() currentUser: User
  ): Promise<Toast[]> {
    const toasts = await this.toastService.getToastsByUserId(id, currentUser);

    return toasts;
  }

  @Delete(':id')
  async deleteToast(
    @Param('id') id: Toast['id'],
    @CurrentUser() currentUser: User
  ): Promise<number> {
    return await this.toastService.deleteToast(id, currentUser);
  }

  @Put(':toastId')
  async editToast(
    @Param('toastId') toastId: string,
    @CurrentUser() currentUser: User,
    @Body() dto: EditToastDto
  ): Promise<{ toast: Toast }> {
    return this.toastService.editToast(toastId, currentUser, dto);
  }
}
