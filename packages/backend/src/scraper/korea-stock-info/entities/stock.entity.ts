import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//TODO : entity update require
@Entity()
export class Master {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id?: number;

  @Column()
  shortCode?: string;

  @Column()
  standardCode?: string;

  @Column()
  koreanName?: string;

  @Column()
  groupCode?: string;

  @Column()
  marketCapSize?: string;
}
