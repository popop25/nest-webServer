import { Controller, Get, UseGuards } from '@nestjs/common';
import { DigestGuard } from './digest/digest.guard';

@Controller('secret')
export class AuthController {
  @Get()
  @UseGuards(DigestGuard)
  getSecret(): string {
    return 'SUCCESS';
  }
}
