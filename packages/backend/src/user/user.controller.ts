import {
  Controller,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/theme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '유저 테마 변경 API',
    description: '유저 테마를 라이트모드인지 다크모드인지 변경합니다.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isLight: {
          type: 'boolean',
          description: 'true: light mode, false: dark mode',
          example: true,
        },
      },
      required: ['isLight'],
    },
  })
  @ApiResponse({ status: 200, description: 'User theme updated successfully' })
  @ApiResponse({ status: 400, description: 'isLight property is required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateTheme(
    @Param('id') id: number,
    @Body('isLight') isLight?: boolean,
  ) {
    return this.userService.updateUserTheme(id, isLight);
  }
}
