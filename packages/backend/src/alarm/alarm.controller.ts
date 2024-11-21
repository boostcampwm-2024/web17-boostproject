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
import { AlarmRequest } from './dto/alarm.request';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  async create(@Body() alarmRequest: AlarmRequest) {
    return await this.alarmService.create(alarmRequest);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Alarm | null> {
    return this.alarmService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: AlarmRequest,
  ): Promise<Alarm> {
    return this.alarmService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.alarmService.delete(id);
    return { message: `Alarm with ID ${id} deleted successfully` };
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: number) {
    return await this.alarmService.findByUserId(userId);
  }

  @Get('stock/:stockId')
  async getByStockId(@Param('stockId') stockId: string) {
    return await this.alarmService.findByStockId(stockId);
  }
}
