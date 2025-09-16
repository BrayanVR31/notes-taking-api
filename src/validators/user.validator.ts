import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

/**
 *  Validate if the user is already exists in database,
 *  using as a reference unique email
 * */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) { }

  async validate(email: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    return !!!user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `User is already exits.`;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint
    })
  }
}
