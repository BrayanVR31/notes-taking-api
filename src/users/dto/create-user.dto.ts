import { IsEmail, IsOptional, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";
import { IsUserAlreadyExist } from "../../validators/user.validator";

export class CreateUserDto {
  @IsNotEmpty({
    message: "Email cannot be empty."
  })
  @IsEmail({
  }, {
    message: "Email must be a valid address."
  })
  @IsUserAlreadyExist()
  email: string;

  @IsNotEmpty({
    message: "Password cannot be empty."
  })
  @MinLength(8, {
    message: "Password must be at least 8 characters"
  })
  @IsStrongPassword()
  password: string;

  @IsOptional()
  profileImage: string;
}
