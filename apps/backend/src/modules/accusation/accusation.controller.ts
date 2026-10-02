import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AccusationService } from './accusation.service';
import { Accusation } from './entities/accusation.entity';
import { CreateAccusationDto } from './dto/create-accusation.dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsAdmin } from '../auth/decorators/is-admin.decorator';

@Controller('accusations')
export class AccusationController {
  constructor(
    @Inject(AccusationService)
    private readonly accusationService: AccusationService
  ) {}

  @Get('user/:userId')
  async getAccusationsByUserId(
    @Param('userId') userId: User['id'],
    @CurrentUser() currentUser: User
  ): Promise<Accusation[]> {
    return this.accusationService.getAccusationsForUser(userId, currentUser);
  }

  @IsAdmin()
  @Get('admin/:userId')
  async getAccusationsByAdminId(
    @Param('userId') userId: User['id']
  ): Promise<Accusation[]> {
    return this.accusationService.getAccusationsByReporter(userId);
  }

  @IsAdmin()
  @Post()
  async createAccusation(
    @Body() dto: CreateAccusationDto,
    @CurrentUser() currentUser: User
  ): Promise<Accusation> {
    return this.accusationService.createAccusation(dto, currentUser);
  }

  @IsAdmin()
  @Delete(':id')
  async deleteAccusation(
    @Param('id') id: Accusation['id'],
    @CurrentUser() currentUser: User
  ): Promise<number> {
    return await this.accusationService.deleteAccusation(id, currentUser);
  }
}
