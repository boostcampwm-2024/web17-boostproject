import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeNicknameRequest {
  @ApiProperty({
    description: '변경할 닉네임',
    example: '9만전자 개미',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
