import { IsString } from "class-validator";

export class MasterDownloadDto {
  @IsString()
  baseDir!: string;

  @IsString()
  target: string;

  constructor(baseDir: string, target: string) {
    this.baseDir = baseDir;
    this.target = target;
  }
}
