import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatType } from '@/chat/domain/chatType.enum';
import { DateEmbedded } from '@/common/dateEmbedded.entity';
import { Stock } from '@/stock/domain/stock.entity';
import { User } from '@/user/domain/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Stock, (stock) => stock.id)
  stock: Stock;

  @Column()
  message: string;

  @Column()
  type: ChatType;

  @Column({ name: 'like_count' })
  likeCount: number;

  @Column(() => DateEmbedded, { prefix: '' })
  date?: DateEmbedded;
}
