import { Type } from '@nestjs/class-transformer';
import {
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from '@nestjs/class-validator';
import { UserWithtoastsCountDto } from '../../user/dto';

export class CountToastsInPeriodByUsersDto {
  @IsArray({ message: 'Users must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UserWithtoastsCountDto)
  users!: UserWithtoastsCountDto[];

  @IsInt({ message: 'Total must be an integer' })
  @Min(0, { message: 'Total cannot be negative' })
  total!: number;
}
