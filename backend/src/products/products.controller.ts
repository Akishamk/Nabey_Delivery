import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get()
  list() {
    return this.svc.listAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }
}
