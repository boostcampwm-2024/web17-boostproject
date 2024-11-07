import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/user/domain/role';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50 })
  nickname?: string;

  @Column({ length: 50 })
  email?: string;

  @Column({ length: 5, default: Role.USER })
  role: Role = Role.USER;

  @Column({ length: 10 })
  type?: string;

  @Column({ name: 'oauth_id' })
  oauthId?: number;

  @Column({ name: 'is_light', default: true })
  isLight: boolean = true;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
