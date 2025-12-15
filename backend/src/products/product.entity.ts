import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../merchants/merchants.entity';

@Entity({ schema: process.env.DB_SCHEMA || 'delivery_app', name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('numeric', { precision: 12, scale: 2 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
