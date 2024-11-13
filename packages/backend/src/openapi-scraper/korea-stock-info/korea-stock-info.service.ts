import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as readline from 'readline';
import * as iconv from 'iconv-lite';
import * as unzipper from 'unzipper';
import { MasterDownloadDto } from './dto/master-download.dto';
import { Master } from './entities/stock.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

@Injectable()
export class KoreaStockInfoService {
  constructor() {
    this.downloadMaster({ baseDir: './', target: 'kosdaq_code' });
    this.downloadMaster({ baseDir: './', target: 'kosdaq_code' });

    this.getKospiMasterData({ baseDir: './', target: 'kosdaq_code' });
    this.getKosdaqMasterData({ baseDir: './', target: 'kosdaq_code' });
  }

  private async downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', (error) => {
          fs.unlinkSync(filePath);
          reject(error);
        });
    });
  }

  private async extractZip(filePath: string, extractTo: string): Promise<void> {
    await fs
      .createReadStream(filePath)
      .pipe(unzipper.Extract({ path: extractTo }))
      .promise();
  }

  private getValueFromMst(row: string, start: number, end: number) {
    return row.slice(start, end).trim();
  }

  public async downloadMaster(downloadDto: MasterDownloadDto): Promise<any> {
    const { baseDir, target } = downloadDto;
    const fileName = target + '.zip';
    const targetFileName = target + '.mst';
    const url =
      process.env.MST_URL +
      target +
      '.mst.zip';
    const filePath = path.join(baseDir, fileName);
    const extractedFile = path.join(baseDir, targetFileName);

    await this.downloadFile(url, filePath);
    await this.extractZip(filePath, baseDir);

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    return extractedFile;
  }

  public async getKospiMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<Master[]> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';
    const kospiMasters: Master[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream(encoding)),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = this.getValueFromMst(row, 0, 9);
      const standardCode = this.getValueFromMst(row, 9, 21);
      const koreanName = this.getValueFromMst(row, 21, row.length - 228);
      const groupCode = this.getValueFromMst(row, row.length - 228, row.length - 226);
      const marketCapSize = this.getValueFromMst(row, row.length - 226, row.length - 225);

      kospiMasters.push({
        shortCode,
        standardCode,
        koreanName,
        groupCode,
        marketCapSize,
      });
    }

    console.log('Done');
    return kospiMasters;
  }

  public async getKosdaqMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<Master[]> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';
    const kosdaqMasters: Master[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream(encoding)),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = this.getValueFromMst(row, 0, 9);
      const standardCode = this.getValueFromMst(row, 9, 21);
      const koreanName = this.getValueFromMst(row, 21, row.length - 222);
      const groupCode = this.getValueFromMst(row, row.length - 222, row.length - 220);
      const marketCapSize = this.getValueFromMst(row, row.length - 220, row.length - 219);

      kosdaqMasters.push({
        shortCode,
        standardCode,
        koreanName,
        groupCode,
        marketCapSize,
      });
    }

    console.log('Done');
    return kosdaqMasters;
  }
}
