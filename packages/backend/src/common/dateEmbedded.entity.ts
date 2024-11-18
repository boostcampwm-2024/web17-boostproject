import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateEmbedded {
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt?: Date;
}
