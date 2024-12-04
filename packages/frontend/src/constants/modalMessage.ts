export type ModalMessage = 'NOT_AUTHENTICATED' | 'NOT_OWNERSHIP' | 'OWNERSHIP';

export const modalMessage = {
  NOT_AUTHENTICATED: {
    label: '내 주식 추가',
    message: `
    로그인 후 이용가능해요. 
    로그인하시겠어요?
  `.trim(),
  },
  NOT_OWNERSHIP: {
    label: '내 주식 추가',
    message: '이 주식을 소유하시겠어요?',
  },
  OWNERSHIP: {
    label: '내 주식 삭제',
    message: '이 주식 소유를 취소하시겠어요?',
  },
};
