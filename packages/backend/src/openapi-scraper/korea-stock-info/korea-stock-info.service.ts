import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as readline from 'readline';
import * as iconv from 'iconv-lite';
import * as unzipper from 'unzipper';
import { DownloadDto } from './dto/download.dto';
import { KospiMaster } from './entities/stock.entity';

@Injectable()
export class KoreaStockInfoService {
  constructor() {
    this.downloadKosdaqMaster({ baseDir: './' });
    this.downloadKospiMaster({ baseDir: './' });

    this.getKospiMasterData('./');
    this.getKosdaqMasterData('./');
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

  public async downloadKosdaqMaster(downloadDto: DownloadDto): Promise<any> {
    const { baseDir } = downloadDto;
    const fileName = 'kosdaq_code.zip';
    const filePath = path.join(baseDir, fileName);
    const extractedFile = path.join(baseDir, 'kosdaq_code.mst');

    await this.downloadFile(
      'https://new.real.download.dws.co.kr/common/master/kosdaq_code.mst.zip',
      filePath,
    );
    await this.extractZip(filePath, baseDir);

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    return extractedFile;
  }

  public async downloadKospiMaster(downloadDto: DownloadDto): Promise<any> {
    const { baseDir } = downloadDto;
    const fileName = 'kospi_code.zip';
    const filePath = path.join(baseDir, fileName);
    const extractedFile = path.join(baseDir, 'kospi_code.mst');

    await this.downloadFile(
      'https://new.real.download.dws.co.kr/common/master/kospi_code.mst.zip',
      filePath,
    );
    await this.extractZip(filePath, baseDir);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    return extractedFile;
  }

  public async getKospiMasterData(baseDir: string): Promise<KospiMaster[]> {
    const fileName = path.join(baseDir, 'kospi_code.mst');
    const kospiMasters: KospiMaster[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream('cp949')),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = row.slice(0, 9).trim();
      const standardCode = row.slice(9, 21).trim();
      const koreanName = row.slice(21, row.length - 228).trim();
      const groupCode = row.slice(-228, -226).trim();
      const marketCapSize = row.slice(-226, -225).trim();

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

  public async getKosdaqMasterData(baseDir: string): Promise<KospiMaster[]> {
    const fileName = path.join(baseDir, 'kosdaq_code.mst');
    const kosdaqMasters: KospiMaster[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream('cp949')),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = row.slice(0, 9).trim();
      const standardCode = row.slice(9, 21).trim();
      const koreanName = row.slice(21, row.length - 222).trim();
      const groupCode = row.slice(-222, -220).trim();
      const marketCapSize = row.slice(-220, -219).trim();

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
