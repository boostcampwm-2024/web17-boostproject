import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserThemeResponse } from './dto/userTheme.response';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '유저 닉네임과 서브 닉네임으로 유저 조회 API',
    description: '유저 닉네임과 서브 닉네임으로 유저를 조회합니다.',
  })
  @ApiParam({ name: 'nickname', type: 'string', description: '유저 닉네임' })
  @ApiParam({ name: 'subName', type: 'string', description: '유저 서브네임' })
  async searchUser(
    @Query('nickname') nickname: string,
    @Query('subName') subName: string,
  ) {
    return await this.userService.searchUserByNicknameAndSubName(
      nickname,
      subName,
    );
  }

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
  ): Promise<UpdateUserThemeResponse> {
    const updatedUser = await this.userService.updateUserTheme(id, isLight);

    return {
      id: updatedUser.id!,
      isLight: updatedUser.isLight!,
      nickname: updatedUser.nickname!,
      updatedAt: updatedUser.date!.updatedAt!,
    };
  }

  @Get(':id/theme')
  @ApiOperation({
    summary: 'Get user theme mode',
    description:
      'Retrieve the current theme mode (light or dark) for a specific user',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User theme retrieved successfully',
    schema: { type: 'boolean' },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getTheme(@Param('id') id: number) {
    const isLight = await this.userService.getUserTheme(id);
    return { isLight };
  }
}
