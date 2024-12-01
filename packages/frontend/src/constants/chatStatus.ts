export const UserStatus = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  NOT_OWNERSHIP: 'NOT_OWNERSHIP',
  OWNERSHIP: 'OWNERSHIP',
} as const;

export type ChatStatus = keyof typeof UserStatus;

export const chatPlaceholder: Record<ChatStatus, string> = {
  NOT_AUTHENTICATED: '로그인 후 입력 가능합니다.',
  NOT_OWNERSHIP: '주식 소유자만 입력 가능합니다.',
  OWNERSHIP: '100자 이내로 입력 가능합니다.',
};
