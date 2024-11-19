import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alarm } from '@/alarm/domain/alarm.entity';
import { DateEmbedded } from '@/common/dateEmbedded.entity';
import { UserStock } from '@/stock/domain/userStock.entity';
import { OauthType } from '@/user/domain/ouathType';
import { Role } from '@/user/domain/role';

@Index('type_oauth_id', ['type', 'oauthId'], { unique: true })
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nickname: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 5, default: Role.USER })
  role: Role = Role.USER;

  @Column({ length: 10, default: OauthType.LOCAL })
  type: OauthType = OauthType.LOCAL;

  @Column('decimal', { name: 'oauth_id' })
  oauthId: string;

  @Column({ name: 'is_light', default: true })
  isLight: boolean = true;

  @Column(() => DateEmbedded, { prefix: '' })
  date: DateEmbedded;

  @OneToMany(() => UserStock, (userStock) => userStock.user)
  userStocks: UserStock[];

  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];
}
