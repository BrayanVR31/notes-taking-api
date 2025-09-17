import { PartialType, OmitType, PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Exclude } from "class-transformer";

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ["email", "password"])) { }
