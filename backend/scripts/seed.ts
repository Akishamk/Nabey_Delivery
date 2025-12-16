import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Merchant } from '../src/merchants/merchants.entity';
import { Product } from '../src/products/product.entity';
import { User } from '../src/users/user.entity';

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || undefined,
    database: process.env.DB_NAME || 'postgres',
    schema: process.env.DB_SCHEMA || 'delivery_app',
  entities: [Merchant, Product, User],
  // Do NOT synchronize schema in seed script to avoid destructive DDL
  // operations on an existing database. Assume schema already exists.
  synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('DataSource initialized.');

  const merchantRepo = dataSource.getRepository(Merchant);
  const productRepo = dataSource.getRepository(Product);
    // Determine an owner user id to assign to the merchant.
    // Prefer SEED_OWNER_ID env var, otherwise pick any existing user in DB.
    const schema = process.env.DB_SCHEMA || 'delivery_app';
    let ownerId = process.env.SEED_OWNER_ID || null;
    if (!ownerId) {
      const rows: any[] = await dataSource.query(`SELECT id FROM ${schema}.users LIMIT 1`);
      if (rows.length > 0) {
        ownerId = rows[0].id;
        console.log('Using existing user id as merchant owner:', ownerId);
      } else {
        console.log('No users found in database; creating a minimal seed user...');
        // Create a minimal user using common columns found in this DB
        const phone = process.env.SEED_USER_PHONE || '0000000000';
        const role = process.env.SEED_USER_ROLE || 'merchant';
        const insertRes: any = await dataSource.query(
          `INSERT INTO ${schema}.users(phone_number, role, is_active) VALUES($1,$2,$3) RETURNING id`,
          [phone, role, true]
        );
        if (insertRes && insertRes[0] && insertRes[0].id) {
          ownerId = insertRes[0].id;
          console.log('Created seed user id:', ownerId);
        } else {
          console.error('Failed to create seed user via raw insert. Columns in users table may differ.');
          const cols: any[] = await dataSource.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='${schema}' AND table_name='users' ORDER BY ordinal_position`);
          console.log('users table columns:', cols.map(c => c.column_name));
          await dataSource.destroy();
          process.exit(1);
        }
      }
    }

    // Insert merchant using a raw insert to set required owner_user_id column
    let merchant = await merchantRepo.findOneBy({ name: 'Seed Merchant' } as any);
    if (!merchant) {
      const insertRes: any = await dataSource.query(
        `INSERT INTO ${schema}.merchants(name, description, address_text) VALUES($1,$2,$3) RETURNING *`,
        ['Seed Merchant', 'Auto-generated merchant by seed script', 'Seed address']
      );
      merchant = insertRes && insertRes[0] ? insertRes[0] : null;
      console.log('Created merchant via raw SQL insert:', merchant ? merchant.id : merchant);
    } else {
      console.log('Merchant already exists:', merchant.id);
    }

    const existingProduct = await productRepo.findOneBy({ name: 'Seed Product' } as any);
    if (!existingProduct) {
      const product = productRepo.create({
        merchant: ({ id: (merchant as any).id } as any),
        name: 'Seed Product',
        description: 'Auto-generated product by seed script',
        price: 9.99,
        available: true,
      } as any);
      const saved = await productRepo.save(product as any);
      console.log('Created product:', saved.id);
    } else {
      console.log('Product already exists:', existingProduct.id);
    }

    await dataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    try { await dataSource.destroy(); } catch {}
    process.exit(1);
  }
}

run();
