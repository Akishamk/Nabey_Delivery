import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerOrLogin(phone_number: string) {
    let user = await this.userRepo.findOne({ where: { phone_number } });
    if (!user) {
      user = this.userRepo.create({ phone_number });
      await this.userRepo.save(user);
    }
    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }
}
