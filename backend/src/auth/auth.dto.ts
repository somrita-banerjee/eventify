import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(64)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(60)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;
}
