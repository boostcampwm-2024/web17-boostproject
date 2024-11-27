export type ModalMessage = 'NOT_AUTHENTICATED' | 'NOT_OWNERSHIP' | 'OWNERSHIP';

export const modalMessage = {
  NOT_AUTHENTICATED: {
    label: '내 주식 추가',
    message: '로그인 후 이용가능합니다. \n로그인하시겠습니까?',
  },
  NOT_OWNERSHIP: {
    label: '내 주식 추가',
    message: '이 주식을 소유하시겠습니까?',
  },
  OWNERSHIP: {
    label: '내 주식 삭제',
    message: '이 주식 소유를 취소하시겠습니까?',
  },
};
