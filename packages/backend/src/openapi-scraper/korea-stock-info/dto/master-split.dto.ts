import { IsArray } from 'class-validator';

export class MasterSplit {
  @IsArray()
  shortCode: [number, number];

  @IsArray()
  standardCode: [number, number];

  @IsArray()
  koreanName: [number, number];

  @IsArray()
  groupCode: [number, number];

  @IsArray()
  marketCapSize: [number, number];

  constructor(
    shortCode: [number, number],
    standardCode: [number, number],
    koreanName: [number, number],
    groupCode: [number, number],
    marketCapSize: [number, number],
  ) {
    this.shortCode = shortCode;
    this.standardCode = standardCode;
    this.koreanName = koreanName;
    this.groupCode = groupCode;
    this.marketCapSize = marketCapSize;
  }
}
