import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as readline from 'readline';
import * as iconv from 'iconv-lite';
import * as unzipper from 'unzipper';
import { MasterDownloadDto } from './dto/master-download.dto';
import { config as dotenvConfig } from 'dotenv';
import { Stock } from '@/stock/domain/stock.entity';
import { DataSource, EntityManager } from 'typeorm';
import { Logger } from 'winston';

dotenvConfig();

@Injectable()
export class KoreaStockInfoService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.initKoreaStockInfo();
  }

  private async existsStockInfo(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, {
      where: {
        id: stockId,
      },
    });
  }
  private async saveStockData(stockData: Stock[]): Promise<void> {
    const manager = this.datasource.manager;

    for (const data of stockData) {
      const exists = await this.existsStockInfo(data.id!, manager);
      if (!exists) {
        await manager.save(Stock, data);
        this.logger.info(`Stock with id ${data.id} has been saved.`);
      } else {
        this.logger.info(`Stock with id ${data.id} already exists.`);
      }
    }
  }
  public async initKoreaStockInfo(): Promise<void> {
    await this.downloadMaster({ baseDir: './', target: 'kosdaq_code' });
    const kosdaqData = await this.getKosdaqMasterData({
      baseDir: './',
      target: 'kosdaq_code',
    });

    this.saveStockData(kosdaqData);

    await this.downloadMaster({ baseDir: './', target: 'kospi_code' });
    const kospiData = await this.getKospiMasterData({
      baseDir: './',
      target: 'kospi_code',
    });
    for await (const data of kospiData) {
      this.datasource.manager.create(Stock, data);
    }

    this.saveStockData(kosdaqData);
  }

  private async downloadFile(url: string, filePath: string): Promise<void> {
    console.log(`Starting download from ${url}`);
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to get '${url}' (${response.statusCode})`),
            );
            return;
          }

          response.pipe(file);

          file.on('finish', () => {
            file.close(() => {
              console.log('Download completed.');
              resolve();
            });
          });
        })
        .on('error', (err) => {
          fs.unlink(filePath, (unlinkError) => {
            if (unlinkError) {
              console.error(`Error deleting file: ${unlinkError.message}`);
            }
            reject(err);
          });
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
    const downloadZipFile = target + '.mst.zip';
    const outputFile = target + '.mst';
    const url = process.env.MST_URL + target + '.mst.zip';
    const downloadZipFilePath = path.join(baseDir, downloadZipFile);
    const extractedFile = path.join(baseDir, outputFile);

    try {
      await this.downloadFile(url, downloadZipFilePath);
      await this.extractZip(downloadZipFilePath, baseDir);
      fs.unlink(downloadZipFilePath, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.error('Error during download or extraction:', error);
    }

    return extractedFile;
  }

  public async getKospiMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<Stock[]> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';
    const kospiMasters: Stock[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream(encoding)),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = this.getValueFromMst(row, 0, 9);
      const koreanName = this.getValueFromMst(row, 21, row.length - 228);
      const groupCode = this.getValueFromMst(
        row,
        row.length - 228,
        row.length - 226,
      );

      kospiMasters.push({
        id: shortCode,
        name: koreanName,
        views: 0,
        isTrading: true,
        groupCode,
      });
    }

    fs.unlink(targetFileName, (unlinkError) => {
      if (unlinkError) {
        console.error(`Error deleting file: ${unlinkError.message}`);
      }
    });
    console.log('Done');
    return kospiMasters;
  }

  public async getKosdaqMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<Stock[]> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';
    const kosdaqMasters: Stock[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream(encoding)),
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const shortCode = this.getValueFromMst(row, 0, 9);
      const koreanName = this.getValueFromMst(row, 21, row.length - 222);
      const groupCode = this.getValueFromMst(
        row,
        row.length - 222,
        row.length - 220,
      );

      kosdaqMasters.push({
        id: shortCode,
        name: koreanName,
        views: 0,
        isTrading: true,
        groupCode,
      });
    }
    fs.unlink(targetFileName, (unlinkError) => {
      if (unlinkError) {
        console.error(`Error deleting file: ${unlinkError.message}`);
      }
    });
    console.log('Done');
    return kosdaqMasters;
  }
}
