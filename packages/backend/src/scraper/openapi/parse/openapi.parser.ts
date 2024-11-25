import { stockDataKeys } from '../type/openapiLiveData.type';

export const parseMessage = (data: string) => {
  try {
    return JSON.parse(data);
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return parseStockData(data);
  }
};
const FIELD_LENGTH: number = stockDataKeys.length;

const parseStockData = (input: string) => {
  const dataBlocks = input.split('|'); // 데이터 구분
  const results = [];
  const size = parseInt(dataBlocks[2]); // 데이터 건수
  const rawData = dataBlocks[3];
  const values = rawData.split('^'); // 필드 구분자 '^'

  for (let i = 0; i < size; i++) {
    //TODO : type narrowing require
    const parsedData: Record<string, string | number | null> = {};
    parsedData['STOCK_ID'] = values[i * FIELD_LENGTH];
    stockDataKeys.forEach((field: string, index: number) => {
      const value = values[index + FIELD_LENGTH * i];
      if (!value) return (parsedData[field] = null);

      // 숫자형 필드 처리
      if (isNaN(parseInt(value))) {
        parsedData[field] = value; // 문자열 그대로 저장
      } else {
        parsedData[field] = parseFloat(value); // 숫자로 변환
      }
    });
    results.push(parsedData);
  }
  return results;
};
