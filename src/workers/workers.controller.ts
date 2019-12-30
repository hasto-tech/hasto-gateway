import { Controller } from '@nestjs/common';
import { OnContractIdentitiesUpdateWorker } from './identities.update.worker';

@Controller()
export class WorkersController {
  constructor() {
    new OnContractIdentitiesUpdateWorker().run();
  }
}
