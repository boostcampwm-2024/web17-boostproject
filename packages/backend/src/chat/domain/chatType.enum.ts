export const ChatType = {
  NORMAL: 'NORMAL',
  BROADCAST: 'BROADCAST',
};

export type ChatType = (typeof ChatType)[keyof typeof ChatType];
