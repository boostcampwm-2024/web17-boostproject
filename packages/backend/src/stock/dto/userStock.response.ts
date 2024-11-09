export class UserStockResponse {
  id: number;
  message: string;
  date: Date;

  constructor(id: number, message: string, date: Date) {
    this.id = id;
    this.message = message;
    this.date = date;
  }
}
