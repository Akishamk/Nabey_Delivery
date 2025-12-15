import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get(':phone')
  async getByPhone(@Param('phone') phone: string) {
    return this.svc.findByPhone(phone);
  }
}
