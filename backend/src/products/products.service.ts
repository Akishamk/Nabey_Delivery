import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  listAll() {
    return this.repo.find({ relations: ['merchant'] });
  }

  create(dto: Partial<Product>) {
    const p = this.repo.create(dto);
    return this.repo.save(p);
  }
}
