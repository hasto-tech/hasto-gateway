import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import EthCrypto from 'eth-crypto';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';

describe('AuthController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
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
