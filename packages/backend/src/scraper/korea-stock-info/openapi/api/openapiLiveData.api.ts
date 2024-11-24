import { DataSource } from 'typeorm';
import { StockLiveData } from '@/stock/domain/stockLiveData.entity';

export class OpenapiLiveData {
  public readonly TR_ID: string = 'H0STCNT0';
  constructor(
    private readonly datasource: DataSource,
  ) {}

  async saveLiveData(data: StockLiveData[]) {
    await this.datasource.manager
    .getRepository(StockLiveData)
    .createQueryBuilder()
    .insert()
    .into(StockLiveData)
    .values(data)
    .execute();
  }

  convertLiveData(messages: Record<string, string>[]) : StockLiveData[] {
    const stockData: StockLiveData[] = [];
    messages.map((message) => {
      const stockLiveData = new StockLiveData();
      stockLiveData.currentPrice = parseFloat(message.STCK_PRPR);
      stockLiveData.changeRate = parseFloat(message.PRDY_CTRT);
      stockLiveData.volume = parseInt(message.CNTG_VOL);
      stockLiveData.high = parseFloat(message.STCK_HGPR);
      stockLiveData.low = parseFloat(message.STCK_LWPR);
      stockLiveData.open = parseFloat(message.STCK_OPRC);
      stockLiveData.previousClose = parseFloat(message.WGHN_AVRG_STCK_PRC);
      stockLiveData.updatedAt = new Date();
      stockData.push(stockLiveData);
    });
    return stockData;
  }
}
