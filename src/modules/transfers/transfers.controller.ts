import { Controller } from '@nestjs/common';
import { JwtService } from 'src/services/jwt.service';
import { IdentitiesService } from '../identity/identities.service';

@Controller('transfers')
export class TransfersControlller {
  constructor(
    private readonly jwtService: JwtService,
    private readonly identitiesService: IdentitiesService,
  ) {}
}
