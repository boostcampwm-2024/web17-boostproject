/* eslint-disable @typescript-eslint/no-explicit-any*/
import * as crypto from 'crypto';
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { openApiConfig } from '../config/openapi.config';
import { TR_ID } from '../type/openapiUtil.type';
import { OpenapiException } from './openapiCustom.error';

const throwOpenapiException = (error: any, url: string) => {
  if (error.message && error.response && error.response.status) {
    throw new OpenapiException(
      `${url} : ${error.message} `,
      error.response.status,
      error,
    );
  } else {
    throw new OpenapiException(
      `Unknown error: ${error.message || 'No message'}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
};

const postOpenApi = async (
  url: string,
  config: typeof openApiConfig,
  body: object,
) => {
  try {
    const response = await axios.post(config.STOCK_URL + url, body);
    return response.data;
  } catch (error) {
    throwOpenapiException(error, url);
  }
};

const getOpenApi = async (
  url: string,
  config: typeof openApiConfig,
  query: object,
  tr_id: TR_ID,
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
    throwOpenapiException(error, url);
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

const decryptAES256 = (
  encryptedText: string,
  key: string,
  iv: string,
): string => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const bufferToObject = (buffer: Buffer): any => {
  try {
    const jsonString = buffer.toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to convert buffer to object:', error);
    throw error;
  }
};

export {
  postOpenApi,
  getOpenApi,
  getTodayDate,
  getPreviousDate,
  getCurrentTime,
  decryptAES256,
  bufferToObject,
};
