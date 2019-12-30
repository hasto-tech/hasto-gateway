export abstract class Worker {
  constructor(private readonly frequency?: number) {}
  private async sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  abstract async job();

  async run() {
    if (!this.frequency) {
      this.job();
    }
    while (true) {
      await this.job();
      await this.sleep(this.frequency);
    }
  }
}
