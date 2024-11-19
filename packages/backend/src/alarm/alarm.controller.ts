import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { Alarm } from './domain/alarm.entity';

@Controller('alarms')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  async create(@Body() alarmData: Partial<Alarm>): Promise<Alarm> {
    return this.alarmService.create(alarmData);
  }

  @Get()
  async findAll(): Promise<Alarm[]> {
    return this.alarmService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Alarm | null> {
    return this.alarmService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Alarm>,
  ): Promise<Alarm> {
    return this.alarmService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.alarmService.delete(id);
    return { message: `Alarm with ID ${id} deleted successfully` };
  }
}
