import {
  IsUUID,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsString,
  MaxLength,
  MinLength,
  IsDate,
} from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';

class ToastDetailsDto {
  @IsOptional()
  @IsString({ message: 'Toast title must be a string' })
  @MaxLength(50, { message: 'Toast title is too long (max 50 characters)' })
  title?: string | null;

  @IsString({ message: 'Toast reason must be a string' })
  @MinLength(3, { message: 'Toast reason must be at least 3 characters' })
  @MaxLength(500, { message: 'Toast reason is too long (max 500 characters)' })
  reason!: string;

  @IsDate({ message: 'Toast dueDate must be a Date object' })
  dueDate!: Date;
}

class InviteeDetailsDto {
  @IsString({ message: 'Invitee username must be a string' })
  @MinLength(3, { message: 'Invitee username must be at least 3 characters' })
  username!: string;
}

export class InviteWithUserAndToastDetailsDto {
  @IsUUID('4', { message: 'Invite ID must be a valid UUID' })
  id!: string;

  @IsUUID('4', { message: 'Toast ID must be a valid UUID' })
  toastId!: string;

  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId!: string;

  @IsOptional()
  @IsBoolean({ message: 'isConfirmed must be a boolean or null' })
  isConfirmed!: boolean | null;

  @ValidateNested()
  @Type(() => ToastDetailsDto)
  toast!: ToastDetailsDto;

  @ValidateNested()
  @Type(() => InviteeDetailsDto)
  invitee!: InviteeDetailsDto;
}
