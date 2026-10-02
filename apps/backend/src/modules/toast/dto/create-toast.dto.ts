import { ToastLocation } from '../entities/toast-location.enum';
import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  IsArray,
  IsDate,
  IsOptional,
  IsBoolean,
} from '@nestjs/class-validator';

export class CreateToastDto {
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId!: string;

  @IsString()
  @MinLength(3, { message: 'Reason must be at least 3 characters long' })
  @MaxLength(500, { message: 'Reason is too long (max 500 characters)' })
  reason!: string;

  @IsString()
  @MaxLength(50, {
    message: 'Title is too long (max 50 characters)',
  })
  @MinLength(2, {
    message: 'Title is too short (min 2 characters)',
  })
  title?: string;

  @IsDate({ message: 'dueDate must be a valid date' })
  dueDate!: Date;

  @IsArray({ message: 'Foods must be an array' })
  @IsString({ each: true, message: 'Each food item must be a string' })
  foods!: string[];

  @IsArray({ message: 'Drinks must be an array' })
  @IsString({ each: true, message: 'Each drink item must be a string' })
  drinks!: string[];

  @IsEnum(ToastLocation, {
    message: `location must be a valid ToastLocation (${Object.values(
      ToastLocation
    ).join(', ')})`,
  })
  location!: ToastLocation;

  @IsString()
  @IsOptional()
  customLocation?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDone must be a boolean' })
  isDone?: boolean;
}
