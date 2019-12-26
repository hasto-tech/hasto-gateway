import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsEthereumAddress } from 'src/utils/custom-validators';

export class AssignTransferDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  readonly whom: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}

export class RemoveTransferDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  readonly whom: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
