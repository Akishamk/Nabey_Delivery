import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Merchant } from '../merchants/merchants.entity';
import { OrderItem } from './order-item.entity';

export enum DeliveryType {
  FOOD = 'food',
  GROCERY = 'grocery',
  PACKAGE = 'package'
}

export enum OrderStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  PICKED_UP = 'picked_up',
  EN_ROUTE = 'en_route',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

@Entity({ schema: process.env.DB_SCHEMA || 'delivery_app', name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.FOOD })
  delivery_type: DeliveryType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column('numeric', { precision: 12, scale: 2, default: 0 })
  total: number;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
