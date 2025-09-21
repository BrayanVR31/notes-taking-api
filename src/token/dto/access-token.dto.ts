import { IsNumber, IsOptional, IsString } from "class-validator";

export class AccessTokenDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  username: string;
}
