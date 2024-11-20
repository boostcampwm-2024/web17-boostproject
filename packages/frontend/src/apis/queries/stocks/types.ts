export interface GetStockListRequest {
  limit: number;
}

export interface GetStockListResponse {
  id: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  volume: number;
  marketCap: string;
}
