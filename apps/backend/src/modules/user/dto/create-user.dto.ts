import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from '@nestjs/class-validator';

export class CreateUserOrLoginDto {
  @IsString({ message: 'שם המשתמש חייב להיות מחרוזת' })
  @MinLength(3, { message: 'שם המשתמש חייב להיות לפחות 3 תווים' })
  @MaxLength(30, { message: 'שם המשתמש יכול להיות עד 30 תווים לכל היותר' })
  username!: string;

  @IsString({ message: 'הסיסמה חייבת להיות מחרוזת' })
  @MinLength(8, { message: 'הסיסמה חייבת להיות באורך של לפחות 8 תווים' })
  @MaxLength(100, { message: 'הסיסמה יכולה להיות עד 100 תווים לכל היותר' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message: 'הסיסמה חייבת להכיל לפחות אות גדולה אחת, אות קטנה אחת ומספר אחד',
  })
  password!: string;
}
