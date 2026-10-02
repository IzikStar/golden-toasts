import {
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  Min,
  IsBoolean,
} from '@nestjs/class-validator';

export class CriminalDto {
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must be at most 30 characters' })
  username!: string;

  @IsInt({ message: 'Accusation count must be an integer' })
  @Min(0, { message: 'Accusation count cannot be negative' })
  accusationCount!: number;

  @IsBoolean({ message: 'isPersonaNonGrata must be a boolean' })
  isPersonaNonGrata!: boolean;
}
