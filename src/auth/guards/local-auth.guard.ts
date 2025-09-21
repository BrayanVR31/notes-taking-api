import { ExecutionContext, Injectable, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { SignInDto } from "../dto/SignIn.dto";

// This will be enable first dto execution before to get started with local strategy
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  private readonly validator = new ValidationPipe({ transform: true });
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const body = request.body ?? {};
    await this.validator.transform(body, {
      type: "body",
      metatype: SignInDto
    })

    return (await super.canActivate(context)) as boolean;
  }
}
