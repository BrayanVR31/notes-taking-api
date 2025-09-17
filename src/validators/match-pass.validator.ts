import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsMatchConfirmPassword(property: string, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "isMatchConfirmPassword",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' && typeof relatedValue === 'string' && value == relatedValue;
        },
      }
    });
  }
}
