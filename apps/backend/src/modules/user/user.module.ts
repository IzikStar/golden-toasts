import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ToastModule } from '../toast/toast.module';
import { Toast } from '../toast/entities/toast.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Toast]), ToastModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
