import axios, { AxiosError } from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 400) {
      alert('잘못된 요청이에요.');
    }

    if (status === 403) {
      alert('로그인 후 이용 가능해요.');
      location.href = '/login';
    }
    return Promise.reject(error);
  },
);
