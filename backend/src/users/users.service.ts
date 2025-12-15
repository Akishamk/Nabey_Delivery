import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone_number: phone } });
  }

  async createPhoneUser(phone: string): Promise<User> {
    const user = this.repo.create({ phone_number: phone, role: UserRole.CUSTOMER });
    return this.repo.save(user);
  }
}
