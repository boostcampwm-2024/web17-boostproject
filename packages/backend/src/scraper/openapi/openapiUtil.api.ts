import axios from 'axios';
import { openApiConfig } from './config/openapi.config';
import { DEFAULT_TR_ID, TR_ID } from './type/openapiUtil.type';

const postOpenApi = async (
  url: string,
  config: typeof openApiConfig,
  body: object,
) => {
  try {
    const response = await axios.post(config.STOCK_URL + url, body);
    return response.data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
};

const getOpenApi = async (
  url: string,
  config: typeof openApiConfig,
  query: object,
  tr_id: TR_ID = DEFAULT_TR_ID,
) => {
  try {
    const response = await axios.get(config.STOCK_URL + url, {
      params: query,
      headers: {
        Authorization: `Bearer ${config.STOCK_API_TOKEN}`,
        appkey: config.STOCK_API_KEY,
        appsecret: config.STOCK_API_PASSWORD,
        tr_id,
        custtype: 'P',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0].replace(/-/g, '');
};

const getPreviousDate = (date: string, months: number): string => {
  const currentDate = new Date(
    date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8),
  );
  currentDate.setMonth(currentDate.getMonth() - months);
  return currentDate.toISOString().split('T')[0].replace(/-/g, '');
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}${minutes}${seconds}`;
};

export {
  postOpenApi,
  getOpenApi,
  getTodayDate,
  getPreviousDate,
  getCurrentTime,
};
