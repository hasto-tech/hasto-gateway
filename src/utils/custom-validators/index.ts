import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { isHexString } from 'ethers/utils';

export function IsEthereumAddress(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsEthereumAddress',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isHexString(value);
        },
      },
    });
  };
}
