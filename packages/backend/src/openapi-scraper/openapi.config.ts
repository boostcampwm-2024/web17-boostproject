import * as dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

export const openApiConfig = {
  PROD: process.env.PROD,
  CANO_REAL: process.env.CANO_REAL,
  APPKEY: process.env.PROD_APPKEY,
  APPSECRET: process.env.PROD_APPSECRET,
};
