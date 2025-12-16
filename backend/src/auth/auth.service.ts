import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerOrLogin(phoneNumber: string) {
    const normalizedPhone = phoneNumber.trim();

    let user = await this.usersService.findByPhone(normalizedPhone);

    if (!user) {
      user = await this.usersService.create(normalizedPhone);
    }

    const payload = {
      sub: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
