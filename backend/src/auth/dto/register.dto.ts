import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['client', 'freelancer'])
  role: string;
}
