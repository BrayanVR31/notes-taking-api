import { IsEmail, MinLength, Matches, ValidationArguments, IsOptional } from "class-validator";
import { getValidationMessage, commonRegexPass } from "../../libs/password";

export class CreateUserDto {
  @IsEmail({
  }, {
    message: "Email must be a valid address"
  })
  email: string;

  @MinLength(8, {
    message: "Password must be at least 8 characters"
  })
  @Matches(new RegExp(commonRegexPass), {
    message: (args: ValidationArguments) => {
      const password = args.value as string;
      return getValidationMessage(password)
    }
  })
  password: string;

  @IsOptional()
  profileImage: string;
}
