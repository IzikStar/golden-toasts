import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from '@nestjs/class-validator';
import { User } from '../entities/user.entity';

export class UserWithtoastsCountDto {
  @IsUUID('4', { message: 'Invalid user ID format' })
  id!: User['id'];

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username!: User['username'];

  @IsBoolean({ message: 'isAdmin must be a boolean' })
  isAdmin!: User['isAdmin'];

  @IsBoolean({ message: 'isPersonaNonGrata must be a boolean' })
  isPersonaNonGrata!: User['isPersonaNonGrata'];

  @IsInt({ message: 'toastsCount must be an integer' })
  @Min(0, { message: 'toastsCount cannot be negative' })
  toastsCount!: number;
}
