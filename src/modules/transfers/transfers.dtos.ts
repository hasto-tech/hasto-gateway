import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsSecp256k1PubKey } from 'src/utils/custom-dtos-validators';

export class AssignTransferDto {
  @IsNotEmpty()
  @IsSecp256k1PubKey()
  readonly whom: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}

export class RemoveTransferDto {
  @IsNotEmpty()
  @IsSecp256k1PubKey()
  readonly whom: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
