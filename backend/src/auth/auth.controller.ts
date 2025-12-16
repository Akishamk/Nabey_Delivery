import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('phone')
  login(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.registerOrLogin(phoneNumber);
  }
}
