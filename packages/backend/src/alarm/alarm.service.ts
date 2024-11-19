import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AlarmService {
  constructor(private readonly dataSource: DataSource) {}
}
