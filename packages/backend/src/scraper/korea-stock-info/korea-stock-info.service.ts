/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as readline from 'readline';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config as dotenvConfig } from 'dotenv';
import * as iconv from 'iconv-lite';
import { DataSource, EntityManager } from 'typeorm';
import * as unzipper from 'unzipper';
import { Logger } from 'winston';
import { MasterDownloadDto } from './dto/master-download.dto';
import { Stock } from '@/stock/domain/stock.entity';

dotenvConfig();

@Injectable()
export class KoreaStockInfoService {
  constructor(
    private readonly datasource: DataSource,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.initKoreaStockInfo();
  }

  @Cron('0 9 * * 1-5')
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

  private async insertStockDataBatch(stocks: Stock[]): Promise<void> {

    if (stocks.length === 0) return;

    const manager = this.datasource.manager;

    // 한 번의 쿼리로 모든 기존 stock_id 조회
    const existingStocks = await manager
      .createQueryBuilder(Stock, "stock")
      .select("stock.id")
      .where("stock.id IN (:...ids)", {
        ids: stocks.map(s => s.id)
      })
      .getRawMany();

    const existingIds = new Set(existingStocks.map(s => s.id));

    // 존재하지 않는 stocks만 필터링
    const newStocks = stocks.filter(s => !existingIds.has(s.id));

    // 새로운 stocks가 있다면 일괄 저장
    if (newStocks.length > 0) {
      await manager.save(Stock, newStocks);
      this.logger.info(`Inserted ${newStocks.length} new stocks`);
    }
  }


  private async getMasterData(
    downloadDto: MasterDownloadDto,
    offset: number,
  ): Promise<void> {
    this.logger.info('\n=== 주식 마스터 데이터 처리 시작 ===');
    const startTime = process.hrtime();

    const targetFileName = downloadDto.target + '.mst';
    const rl = this.beforeMasterData(downloadDto);

    let totalCount = 0;
    let queryCount = 0;
    const stocks: Stock[] = [];


    for await (const row of rl) {
      totalCount++;
      const shortCode = this.getValueFromMst(row, 0, 9);
      const koreanName = this.getValueFromMst(row, 21, row.length - offset);
      const groupCode = this.getValueFromMst(
        row,
        row.length - offset,
        row.length - offset + 2,
      );

      stocks.push({
        id: shortCode,
        name: koreanName,
        views: 0,
        isTrading: true,
        groupCode,
      });


      // 배치 크기가 되면 처리 (메모리 관리를 위해)
      if (stocks.length >= 100) {
        queryCount++;
        await this.insertStockDataBatch([...stocks]);
        stocks.length = 0; // 배열 비우기
      }
    }

    // 남은 stocks 처리
    if (stocks.length > 0) {
      await this.insertStockDataBatch(stocks);
    }

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
    this.logger.info('\n=== 주식 마스터 데이터 처리 완료 ===');
    this.logger.info(`총 처리된 데이터: ${totalCount}개`);
    this.logger.info(`실행된 쿼리 수: ${queryCount}개`);
    this.logger.info(`총 처리 시간: ${milliseconds.toFixed(2)}ms`);
    this.logger.info('===============================\n');

    this.handleUnlinkFile(targetFileName);
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
    await this.getMasterData(downloadDto, 228);
    this.logger.info('Kospi master data processing done.');
  }

  public async getKosdaqMasterData(
    downloadDto: MasterDownloadDto,
  ): Promise<void> {
    await this.getMasterData(downloadDto, 222);
    this.logger.info('Kosdaq master data processing done.');
  }

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
          this.handleUnlinkFile(filePath, err, reject);
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

  private beforeMasterData(downloadDto: MasterDownloadDto): readline.Interface {
    const targetFileName = downloadDto.target + '.mst';
    const fileName = path.join(downloadDto.baseDir, targetFileName);
    const encoding = 'cp949';

    return readline.createInterface({
      input: fs.createReadStream(fileName).pipe(iconv.decodeStream(encoding)),
      crlfDelay: Infinity,
    });
  }

  private handleUnlinkFile(
    targetFileName: string,
    err?: Error,
    callback?: (err: Error) => void,
  ) {
    fs.unlink(targetFileName, (unlinkError) => {
      if (unlinkError) {
        this.logger.error(`Error deleting file: ${unlinkError.message}`);
      }
      if (callback && err) {
        callback(err);
      }
    });
  }
}
