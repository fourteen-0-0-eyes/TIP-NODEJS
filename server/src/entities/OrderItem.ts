import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";
import { Contract } from "./Contract";

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((_type) => Order, (order: Order) => order.orderItems)
  @JoinColumn()
  order!: Order;

  @ManyToOne((_type) => Contract, (product: Contract) => product.id)
  @JoinColumn()
  contract!: Contract;

  @Column()
  contractId: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
