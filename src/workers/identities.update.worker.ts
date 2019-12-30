import { Worker } from '../utils/worker.definition';

// TODO
export class OnContractIdentitiesUpdateWorker extends Worker {
  constructor(frequency?: number) {
    super(frequency);
  }

  async job() {}
}
