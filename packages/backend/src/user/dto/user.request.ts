import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Theme } from '@/user/domain/theme';

export class ChangeNicknameRequest {
  @ApiProperty({
    description: '변경할 닉네임',
    example: '9만전자 개미',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

export class ChangeThemeRequest {
  @ApiProperty({
    description: '변경을 원하는 테마',
    example: 'light',
    enum: ['light', 'dark'],
  })
  @IsNotEmpty()
  @IsEnum(Theme)
  theme: Theme;
}

export class UserThemeResponse {
  @ApiProperty({
    description: '유저 테마',
    example: 'light',
  })
  theme: Theme;
}
