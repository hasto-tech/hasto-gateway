import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import EthCrypto from 'eth-crypto';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const identity = EthCrypto.createIdentity();

  it('/auth/request-challange/:ethereumAddress (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/auth/request-challange/:${identity.address}`)
      .expect(200);
  });
});
