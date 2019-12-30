import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { isHexString } from 'ethers/utils';

import { isSecp256k1PubKey } from '../custom-validators';

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

export function IsSecp256k1PubKey(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsSecp256k1PubKey',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isSecp256k1PubKey(value);
        },
      },
    });
  };
}
