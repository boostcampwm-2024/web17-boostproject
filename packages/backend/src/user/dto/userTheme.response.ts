import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class UpdateUserThemeResponse {
  @IsString()
  nickname: string;

  @IsBoolean()
  isLight: boolean;

  @IsDateString()
  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;
}
