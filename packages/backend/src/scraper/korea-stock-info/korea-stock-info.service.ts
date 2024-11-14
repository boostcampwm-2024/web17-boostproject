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
import { Cron } from '@nestjs/schedule';

dotenvConfig();

@Injectable()
export class KoreaStockInfoService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  private async existsStockInfo(stockId: string, manager: EntityManager) {
    return await manager.exists(Stock, {
      where: {
        id: stockId,
      },
    });
  }

  private async insertStockData(stock: Stock): Promise<void> {
    const manager = this.datasource.manager;
    const exists = await this.existsStockInfo(stock.id!, manager);
    if (!exists) {
      await manager.save(Stock, stock);
    }
  }

  @Cron('0 0 * * 1-5')
  public async initKoreaStockInfo(): Promise<void> {
    await this.downloadMaster({ baseDir: './', target: 'kosdaq_code' });
    await this.getKosdaqMasterData({
      baseDir: './',
      target: 'kosdaq_code',
    });

    await this.downloadMaster({ baseDir: './', target: 'kospi_code' });
    await this.getKospiMasterData({
      baseDir: './',
      target: 'kospi_code',
    });
  }

  private async downloadFile(url: string, filePath: string): Promise<void> {
    this.logger.info(`Starting download from ${url}`);
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
              this.logger.info('Download completed.');
              resolve();
            });
          });
        })
        .on('error', (err) => {
          fs.unlink(filePath, (unlinkError) => {
            if (unlinkError) {
              this.logger.error(`Error deleting file: ${unlinkError.message}`);
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
    this.logger.info(`Downloading file from ${url} to ${downloadZipFile}`);
    const downloadZipFilePath = path.join(baseDir, downloadZipFile);
    const extractedFile = path.join(baseDir, outputFile);

    try {
      await this.downloadFile(url, downloadZipFilePath);
      await this.extractZip(downloadZipFilePath, baseDir);
      fs.unlink(downloadZipFilePath, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      this.logger.error('Error during download or extraction:', error);
    }

    return extractedFile;
  }

  public async getKospiMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<void> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';

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

      const kospiMaster: Stock = {
        id: shortCode,
        name: koreanName,
        views: 0,
        isTrading: true,
        groupCode,
      };

      await this.insertStockData(kospiMaster);
    }

    fs.unlink(targetFileName, (unlinkError) => {
      if (unlinkError) {
        this.logger.error(`Error deleting file: ${unlinkError.message}`);
      }
    });
    this.logger.info('Kospi master data processing done.');
  }

  public async getKosdaqMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<void> {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';

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

      const kosdaqMaster: Stock = {
        id: shortCode,
        name: koreanName,
        views: 0,
        isTrading: true,
        groupCode,
      };

      await this.insertStockData(kosdaqMaster);
    }
    fs.unlink(targetFileName, (unlinkError) => {
      if (unlinkError) {
        this.logger.error(`Error deleting file: ${unlinkError.message}`);
      }
    });
    this.logger.info('Kosdaq master data processing done.');
  }
}
