import { Transform } from 'class-transformer';
import { IsInt, IsString, IsBoolean, IsDateString } from 'class-validator';

export class UpdateUserThemeResponse {
  @IsInt()
  id: number;

  @IsString()
  nickname: string;

  @IsBoolean()
  isLight: boolean;

  @IsDateString()
  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;
}
