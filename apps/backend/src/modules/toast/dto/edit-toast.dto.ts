import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  IsEnum,
  IsBoolean,
  IsDate,
  IsUUID,
} from '@nestjs/class-validator';
import { ToastLocation } from '../entities/toast-location.enum';

export class EditToastDto {
  @IsOptional()
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId!: string;
  
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Title is too short (min 2 characters)' })
  @MaxLength(50, { message: 'Title is too long (max 50 characters)' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Reason must be at least 3 characters long' })
  @MaxLength(500, { message: 'Reason is too long (max 500 characters)' })
  reason?: string;

  @IsOptional()
  @IsArray({ message: 'Foods must be an array' })
  @IsString({ each: true, message: 'Each food must be a string' })
  foods?: string[];

  @IsOptional()
  @IsArray({ message: 'Drinks must be an array' })
  @IsString({ each: true, message: 'Each drink must be a string' })
  drinks?: string[];

  @IsOptional()
  @IsEnum(ToastLocation, {
    message: `Location must be a valid value: ${Object.values(
      ToastLocation
    ).join(', ')}`,
  })
  location?: ToastLocation;

  @IsString()
  @IsOptional()
  customLocation?: string;

  @IsOptional()
  @IsDate({ message: 'dueDate must be a valid date' })
  dueDate?: Date;

  @IsOptional()
  @IsBoolean({ message: 'isDone must be a boolean' })
  isDone?: boolean;
}
