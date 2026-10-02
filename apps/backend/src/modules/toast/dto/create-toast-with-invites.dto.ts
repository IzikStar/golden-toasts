import { ValidateNested, IsArray } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { CreateToastDto } from './create-toast.dto';

export class CreateToastWithInvitesDto {
  @ValidateNested()
  @Type(() => CreateToastDto)
  toast!: CreateToastDto;

  @IsArray()
  @Type(() => String)
  invites!: string[];
}
