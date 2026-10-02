import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { Invite } from './entities/invite.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToastModule } from '../toast/toast.module';

@Module({
  imports: [SequelizeModule.forFeature([Invite]), ToastModule],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
