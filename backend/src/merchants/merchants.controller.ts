import { Body, Controller, Get, Post } from '@nestjs/common';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
export class MerchantsController {
  constructor(private svc: MerchantsService) {}

  @Get()
  list() {
    return this.svc.listAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.svc.createOne(body);
  }
}
