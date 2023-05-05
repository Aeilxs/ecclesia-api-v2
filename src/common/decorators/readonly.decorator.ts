import { ValidationOptions, registerDecorator } from 'class-validator';

export function ReadOnly(validationOptions?: ValidationOptions) {
  return function (dto: any, propertyName: string) {
    registerDecorator({
      name: 'readOnly',
      target: dto.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate() {
          return false;
        },
        defaultMessage() {
          return '$property is read only';
        },
      },
    });
  };
}
