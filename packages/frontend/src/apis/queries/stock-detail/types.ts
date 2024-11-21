export interface PostStockViewRequest {
  stockId: string;
}

export interface PostStockViewResponse {
  id: string;
  message: string;
  date: Date;
}
