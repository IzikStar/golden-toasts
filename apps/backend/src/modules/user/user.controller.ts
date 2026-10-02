import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserOrLoginDto, CriminalDto, EditUserDto } from './dto';
import { User } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ToastService } from '../toast/toast.service';
import { CountToastsInPeriodByUsersDto } from '../toast/dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ToastService)
    private readonly toastService: ToastService
  ) {}

  @Public()
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserOrLoginDto
  ): Promise<{ accessToken: string }> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const allUsers = await this.userService.getAllUsers();

    return allUsers;
  }

  @Get('criminals')
  async getCriminals(): Promise<CriminalDto[]> {
    return this.userService.getCriminalsWithCrimesCount();
  }

  @Get(':userId/current-period-toasts-amount')
  async getCurrentPeriodToastsAmount(
    @Param('userId') userId: string
  ): Promise<number | CountToastsInPeriodByUsersDto> {
    const currentPeriodToastAmount =
      await this.toastService.getToastsAmountForCurrentPeriod(userId);

    return currentPeriodToastAmount;
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<User> {
    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Delete(':id')
  async deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: User['id']
  ): Promise<number> {
    return await this.userService.deleteUser(id, currentUser);
  }

  @Put(':userId')
  async editUser(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
    @Body() dto: EditUserDto
  ): Promise<{ user: User; newToken?: string }> {
    const editResult = this.userService.editUser(userId, currentUser, dto);

    return {
      user: plainToInstance(User, (await editResult).user, {
        excludeExtraneousValues: true,
      }),
      newToken: (await editResult).newToken,
    };
  }
}
