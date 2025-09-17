import { IsEmail, IsOptional, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";
import { Exclude, Expose } from "class-transformer";
import { IsUserAlreadyExist } from "../../validators/user.validator";

export class CreateUserDto {
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty({
    message: "Email cannot be empty."
  })
  @IsEmail({
  }, {
    message: "Email must be a valid address."
  })
  @IsUserAlreadyExist()
  readonly email: string;

  @Exclude({ toPlainOnly: true })
  @IsNotEmpty({
    message: "Password cannot be empty."
  })
  @MinLength(8, {
    message: "Password must be at least 8 characters"
  })
  @IsStrongPassword()
  readonly password: string;

  @Expose({
    name: "profile_image"
  })
  @IsOptional()
  readonly profileImage: string;
}
