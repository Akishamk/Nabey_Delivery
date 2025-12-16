import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from './users/user.entity';
import { Merchant } from './merchants/merchants.entity';
import { Product } from './products/product.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [User, Merchant, Product],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const merchantRepo = AppDataSource.getRepository(Merchant);
  const productRepo = AppDataSource.getRepository(Product);

  const u = userRepo.create({ phoneNumber: '+251900000001' });
  await userRepo.save(u);

  const m = merchantRepo.create({ name: 'Tasty Pizza', description: 'Best pizza', address_text: 'Main St' });
  await merchantRepo.save(m);

  const p1 = productRepo.create({ merchant: m, name: 'Margherita', price: 5.5 });
  const p2 = productRepo.create({ merchant: m, name: 'Pepperoni', price: 6.5 });
  await productRepo.save([p1, p2]);

  console.log('Seeded');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
