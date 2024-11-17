import axios from 'axios';

const postOpenApi = async (url: string, body: {}): Promise<any> => {
  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
};

const getOpenApi = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
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

export { postOpenApi, getOpenApi, getTodayDate, getPreviousDate };
