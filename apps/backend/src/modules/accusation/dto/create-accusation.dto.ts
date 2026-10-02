import {
  IsUUID,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class CreateAccusationDto {
  @IsUUID('4', { message: 'reporterId must be a valid UUID' })
  reporterId!: string;

  @IsUUID('4', { message: 'accusedUserId must be a valid UUID' })
  accusedUserId!: string;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @MinLength(3, { message: 'Reason must be at least 3 characters' })
  @MaxLength(500, { message: 'Reason must be at most 500 characters' })
  reason?: string;

  @IsOptional()
  @IsUUID('4', { message: 'crimeToast must be a valid UUID' })
  crimeToastId?: string;
}
