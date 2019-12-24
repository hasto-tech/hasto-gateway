import {
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class SetIdentityDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  readonly phoneNumber?: string;
}

export class ConfirmIdentityDto {
  @IsNotEmpty()
  readonly confirmationCode: string;
}
