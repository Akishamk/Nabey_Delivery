import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Merchant } from './merchants/merchants.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

import { UsersModule } from './users/users.module';
import { MerchantsModule } from './merchants/merchants.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
  // support both DB_USERNAME/DB_PASSWORD and DB_USER/DB_PASS
  username: process.env.DB_USERNAME || process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA || 'delivery_app',
      entities: [User, Merchant, Product, Order, OrderItem],
  // Disable automatic schema sync to avoid destructive DDL on an existing DB.
  // If you explicitly want sync in dev, set TYPEORM_SYNC=true in your .env
  synchronize: process.env.TYPEORM_SYNC === 'true' ? true : false,
      logging: false,
    }),
    UsersModule,
    MerchantsModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
