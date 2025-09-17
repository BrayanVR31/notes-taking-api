import { PartialType } from "@nestjs/mapped-types";
import { SignInDto } from "./SignIn.dto";
import { IsMatchConfirmPassword } from "../../validators/match-pass.validator";

export class SignUpDto extends PartialType(SignInDto) {
  @IsMatchConfirmPassword("password")
  readonly confirmPassword: string;
}
