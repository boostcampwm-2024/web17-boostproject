import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from '@/stock/domain/stock.entity';
import { User } from '@/user/domain/user.entity';

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.alarms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Stock, (stock) => stock.alarms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({ type: 'int', name: 'target_price', nullable: true })
  targetPrice?: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'target_volume',
    nullable: true,
  })
  targetVolume?: number;

  @Column({ type: 'timestamp', name: 'alarm_date', nullable: true })
  alarmExpiredDate?: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
