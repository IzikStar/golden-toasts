import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../modules/user/user.module';
import { ToastModule } from '../modules/toast/toast.module';
import { InviteModule } from '../modules/invite/invite.module';
import { AccusationModule } from '../modules/accusation/accusation.module';
import { AuthModule } from '../modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../modules/auth/guards/auth.guard';
import { getDatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRoot(getDatabaseConfig()),
    ToastModule,
    InviteModule,
    AccusationModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
