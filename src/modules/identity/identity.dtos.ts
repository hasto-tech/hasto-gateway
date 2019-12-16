import { IsEmail, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class SetIdentityDto {
  @IsEmail()
  readonly email?: string;

  @IsPhoneNumber(null)
  readonly phoneNumber?: string;
}

export class ConfirmIdentityDto {
  @IsNotEmpty()
  readonly confirmationCode: string;
}
