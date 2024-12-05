import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/apis/queries/errorSchema';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const { message } = error.response?.data as ErrorResponse;

    if (status === 400) {
      alert(message);
    }

    if (status === 403) {
      alert('로그인 후 이용 가능해요.');
      location.href = '/login';
    }
    return Promise.reject(error);
  },
);
