import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body('phone_number') phone_number: string) {
    if (!phone_number) return { error: 'phone_number required' };
    return this.auth.registerOrLogin(phone_number);
  }
}
