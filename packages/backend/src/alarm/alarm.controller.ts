import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AlarmService } from './alarm.service';
import { Alarm } from './domain/alarm.entity';
import { AlarmRequest } from './dto/alarm.request';
import { AlarmResponse } from './dto/alarm.response';
import SessionGuard from '@/auth/session/session.guard';
import { GetUser } from '@/common/decorator/user.decorator';
import { User } from '@/user/domain/user.entity';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  @ApiOperation({
    summary: '알림 생성',
    description: '각 정보에 맞는 알림을 생성한다.',
  })
  @ApiOkResponse({
    description: '알림 생성 완료',
    type: Alarm,
  })
  @UseGuards(SessionGuard)
  async create(
    @Body() alarmRequest: AlarmRequest,
    @GetUser() user: User,
  ): Promise<AlarmResponse> {
    const userId = user.id;

    return await this.alarmService.create(alarmRequest, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '등록된 알림 확인',
    description: '등록된 알림을 알림 아이디를 기준으로 찾을 수 있다.',
  })
  @ApiOkResponse({
    description: '알림 아이디와 동일한 알림 찾음',
    type: Alarm,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @UseGuards(SessionGuard)
  async findOne(@Param('alarmId') alarmId: number): Promise<AlarmResponse> {
    return this.alarmService.findOne(alarmId);
  }

  @Put(':id')
  @ApiOperation({
    summary: '등록된 알림 업데이트',
    description: '알림 아이디 기준으로 업데이트를 할 수 있다.',
  })
  @ApiOkResponse({
    description: '아이디와 동일한 알림 업데이트',
    type: Alarm,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @UseGuards(SessionGuard)
  async update(
    @Param('alarmId') alarmId: number,
    @Body() updateData: AlarmRequest,
  ): Promise<AlarmResponse> {
    return this.alarmService.update(alarmId, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '등록된 알림 업데이트',
    description: '알림 아이디 기준으로 업데이트를 할 수 있다.',
  })
  @ApiOkResponse({
    description: '아이디와 동일한 알림 업데이트',
    type: Alarm,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @UseGuards(SessionGuard)
  async delete(@Param('alarmId') alarmId: number) {
    await this.alarmService.delete(alarmId);
    return { message: '알림이 정상적으로 삭제되었습니다.' };
  }

  @Get('user')
  @ApiOperation({
    summary: '사용자별 알림 조회',
    description: '사용자 아이디를 기준으로 모든 알림을 조회한다.',
  })
  @ApiOkResponse({
    description: '사용자에게 등록되어 있는 모든 알림 조회',
    type: [Alarm],
  })
  @UseGuards(SessionGuard)
  async getByUserId(@GetUser() user: User) {
    const userId = user.id;

    return await this.alarmService.findByUserId(userId);
  }

  @Get('stock/:stockId')
  @ApiOperation({
    summary: '주식별 알림 조회',
    description: '주식 아이디를 기준으로 알림을 조회한다.',
  })
  @ApiOkResponse({
    description:
      '주식 아이디에 등록되어 있는 알림 중 유저에 해당하는 알림 조회',
    type: [Alarm],
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: '주식 아이디',
    example: '005930',
  })
  @UseGuards(SessionGuard)
  async getByStockId(@Param('stockId') stockId: string, @GetUser() user: User) {
    const userId = user.id;

    return await this.alarmService.findByStockId(stockId, userId);
  }
}
