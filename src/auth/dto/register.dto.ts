import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Matches(/password/, {
    message: 'Passwords do not match',
  })
  repeatPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
