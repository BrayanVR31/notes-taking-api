import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSessionDto {
  @IsUUID()
  id: string;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  token: string | null;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}
