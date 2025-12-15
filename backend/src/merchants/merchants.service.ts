import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './merchants.entity';

@Injectable()
export class MerchantsService {
  constructor(@InjectRepository(Merchant) private repo: Repository<Merchant>) {}

  listAll() {
    return this.repo.find();
  }

  createOne(dto: Partial<Merchant>) {
    const m = this.repo.create(dto);
    return this.repo.save(m);
  }
}
