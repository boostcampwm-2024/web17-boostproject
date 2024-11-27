import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateEmbedded } from '@/common/dateEmbedded.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { User } from '@/user/domain/user.entity';

@Index('user_stock', ['user', 'stock'], { unique: true })
@Entity()
export class UserStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Stock)
  stock: Stock;

  @Column(() => DateEmbedded, { prefix: '' })
  date: DateEmbedded;
}
