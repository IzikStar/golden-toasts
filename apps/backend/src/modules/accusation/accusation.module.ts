import { Module } from '@nestjs/common';
import { AccusationService } from './accusation.service';
import { AccusationController } from './accusation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Accusation } from './entities/accusation.entity';

@Module({
  imports: [SequelizeModule.forFeature([Accusation])],
  controllers: [AccusationController],
  providers: [AccusationService],
  exports: [AccusationModule]
})
export class AccusationModule {}
