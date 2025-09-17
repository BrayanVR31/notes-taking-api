import { IsEmail, IsString, IsStrongPassword, ValidateIf } from "class-validator";

export class SignInDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}

