export type ChatPlaceholder =
  | 'NOT_AUTHENTICATED'
  | 'NOT_OWNERSHIP'
  | 'OWNERSHIP';

export const chatPlaceholder = {
  NOT_AUTHENTICATED: {
    message: '로그인 후 입력 가능합니다.',
  },
  NOT_OWNERSHIP: {
    message: '주식 소유자만 입력 가능합니다.',
  },
  OWNERSHIP: {
    message: '100자 이내로 입력 가능합니다.',
  },
};
