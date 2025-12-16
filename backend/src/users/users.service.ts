import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findByPhone(phone: string) {
    return this.repo.findOne({ where: { phoneNumber: phone } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(phone: string) {
    const user = this.repo.create({ phoneNumber: phone });
    return this.repo.save(user);
  }
}
