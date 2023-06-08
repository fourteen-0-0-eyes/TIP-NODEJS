import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ELevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export enum ESize {
  small = "small",
  medium = "medium",
  big = "big",
}

@Entity()
export class Contract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text" })
  longDescription!: string;

  @Column({ type: "decimal", default: 0.01 })
  price!: number;

  @Column({ default: 0 })
  countInStock!: number;

  @Column({ default: 0 })
  discount!: number;

  @Column({ type: "enum", enum: ESize, default: ESize.medium })
  size!: ESize;

  @Column({ default: 0 })
  sold!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
