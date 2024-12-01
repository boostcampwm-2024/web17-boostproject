import { ApiProperty } from '@nestjs/swagger';
import { Theme } from '@/user/domain/theme';

export class UpdateUserThemeResponse {
  @ApiProperty({
    description: '유저 테마',
    example: 'light',
  })
  theme: Theme;

  @ApiProperty({
    description: '테마 변경 시간',
    example: new Date(),
  })
  updatedAt: Date;
}
