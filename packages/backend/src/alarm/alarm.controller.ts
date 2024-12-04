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
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AlarmService } from './alarm.service';
import { AlarmRequest } from './dto/alarm.request';
import { AlarmResponse, AlarmSuccessResponse } from './dto/alarm.response';
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
  @ApiResponse({
    status: 201,
    description: '알림 생성 완료',
    type: AlarmResponse,
  })
  @ApiBadRequestResponse({
    description: '유효하지 않은 알람 입력값으로 인해 예외가 발생했습니다.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '알람 조건을 다시 확인해주세요.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @UseGuards(SessionGuard)
  async create(
    @Body() alarmRequest: AlarmRequest,
    @GetUser() user: User,
  ): Promise<AlarmResponse> {
    const userId = user.id;

    return await this.alarmService.create(alarmRequest, userId);
  }

  @Get('user')
  @ApiOperation({
    summary: '사용자별 알림 조회',
    description: '사용자 아이디를 기준으로 모든 알림을 조회한다.',
  })
  @ApiOkResponse({
    description: '사용자에게 등록되어 있는 모든 알림 조회',
    type: [AlarmResponse],
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
    type: [AlarmResponse],
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: '주식 아이디',
    example: '005930',
  })
  @UseGuards(SessionGuard)
  async getByStockId(@Param('id') stockId: string, @GetUser() user: User) {
    const userId = user.id;

    return await this.alarmService.findByStockId(stockId, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '등록된 알림 확인',
    description: '등록된 알림을 알림 아이디를 기준으로 찾을 수 있다.',
  })
  @ApiOkResponse({
    description: '알림 아이디와 동일한 알림 찾음',
    type: AlarmResponse,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @UseGuards(SessionGuard)
  async findOne(@Param('id') alarmId: number): Promise<AlarmResponse> {
    return this.alarmService.findOne(alarmId);
  }

  @Put(':id')
  @ApiOperation({
    summary: '등록된 알림 업데이트',
    description: '알림 아이디 기준으로 업데이트를 할 수 있다.',
  })
  @ApiOkResponse({
    description: '아이디와 동일한 알림 업데이트',
    type: AlarmResponse,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @ApiBadRequestResponse({
    description: '유효하지 않은 알람 입력값으로 인해 예외가 발생했습니다.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '알람 조건을 다시 확인해주세요.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @UseGuards(SessionGuard)
  async update(
    @Param('id') alarmId: number,
    @Body() updateData: AlarmRequest,
  ): Promise<AlarmResponse> {
    return this.alarmService.update(alarmId, updateData);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: '알림 아이디',
    example: 1,
  })
  @ApiOperation({
    summary: '등록된 알림 삭제',
    description: '알림 아이디 기준으로 삭제를 할 수 있다.',
  })
  @ApiOkResponse({
    description: '아이디와 동일한 알림 삭제',
    type: AlarmSuccessResponse,
  })
  @UseGuards(SessionGuard)
  async delete(@Param('id') alarmId: number) {
    await this.alarmService.delete(alarmId);

    return new AlarmSuccessResponse('알림 삭제를 성공했습니다.');
  }
}
