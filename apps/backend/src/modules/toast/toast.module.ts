import { Module } from '@nestjs/common';
import { ToastService } from './toast.service';
import { ToastController } from './toast.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Toast } from './entities/toast.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Toast, User])],
  controllers: [ToastController],
  providers: [ToastService],
  exports: [ToastService],
})
export class ToastModule {}
