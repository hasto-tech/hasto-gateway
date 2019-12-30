import { Injectable } from '@nestjs/common';

import { Contract, providers } from 'ethers';

// TODO
@Injectable()
export class ContractService {
  public contractInstance: Contract;
  constructor() {}
}
