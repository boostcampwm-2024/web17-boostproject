import * as dotenv from 'dotenv';

dotenv.config();

export const openApiConfig: {
  STOCK_URL: string | undefined;
  STOCK_ACCOUNT: string | undefined;
  STOCK_API_KEY: string | undefined;
  STOCK_API_PASSWORD: string | undefined;
  STOCK_API_TOKEN?: string;
  STOCK_WEBSOCKET_KEY?: string;
  STOCK_API_TIMEOUT?: Date;
  STOCK_WEBSOCKET_TIMEOUT?: Date;
} = {
  STOCK_URL: process.env.STOCK_URL,
  STOCK_ACCOUNT: process.env.STOCK_ACCOUNT,
  STOCK_API_KEY: process.env.STOCK_API_KEY,
  STOCK_API_PASSWORD: process.env.STOCK_API_PASSWORD,
};
