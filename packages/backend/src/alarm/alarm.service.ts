import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Alarm } from './domain/alarm.entity';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    private readonly dataSource: DataSource,
  ) {}

  async create(alarmData: Partial<Alarm>): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      const newAlarm = repository.create(alarmData);
      return repository.save(newAlarm);
    });
  }

  async findAll(): Promise<Alarm[]> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      return repository.find({ relations: ['user', 'stock'] });
    });
  }

  async findOne(id: number): Promise<Alarm | null> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);
      return repository.findOne({
        where: { id },
        relations: ['user', 'stock'],
      });
    });
  }

  async update(id: number, updateData: Partial<Alarm>): Promise<Alarm> {
    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);

      const alarm = await repository.findOne({ where: { id } });
      if (!alarm) {
        throw new NotFoundException(`Alarm with ID ${id} not found`);
      }

      await repository.update(id, updateData);
      return (
        (await this.alarmRepository.findOne({
          where: { id },
          relations: ['user', 'stock'],
        })) ?? new Alarm()
      );
    });
  }

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Alarm);

      const alarm = await repository.findOne({ where: { id } });
      if (!alarm) {
        throw new NotFoundException(`Alarm with ID ${id} not found`);
      }

      await repository.delete(id);
    });
  }
}
