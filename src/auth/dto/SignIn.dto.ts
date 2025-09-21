import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, ValidateIf } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}

