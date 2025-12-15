import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  create(orderDto: Partial<Order>) {
    const o = this.repo.create(orderDto);
    return this.repo.save(o);
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['items', 'items.product'] });
  }
}
