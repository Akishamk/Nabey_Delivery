import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devsecret',
      // Cast signOptions to SignOptions so TypeScript accepts the
      // environment-provided string or a default like '30d'.
      signOptions: ({ expiresIn: process.env.JWT_EXPIRES_IN ?? '30d' } as SignOptions),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
