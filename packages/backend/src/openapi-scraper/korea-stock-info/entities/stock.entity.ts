import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class KospiMaster {
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
