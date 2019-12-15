import { Injectable, Scope } from '@nestjs/common';
import { SHA256, enc } from 'crypto-js';

@Injectable({ scope: Scope.DEFAULT })
export class HashcashService {
  static verify(
    difficulty: number,
    durationDecimals: number,
    solution: number,
  ): boolean {
    const now = Date.now() / 1000;
    const roundedCurrentTimestamp =
      Math.floor(now / Math.pow(10, durationDecimals)) *
      Math.pow(10, durationDecimals);

    const hash = SHA256(`${roundedCurrentTimestamp}:${solution}`).toString(
      enc.Hex,
    );

    let tmp = '';
    for (let i = 0; i < difficulty; i++) {
      tmp += '0';
    }

    return hash.slice(0, difficulty) == tmp;
  }
}
