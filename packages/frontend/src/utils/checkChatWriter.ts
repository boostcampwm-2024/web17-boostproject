import { ChatData } from '@/sockets/schema';

interface CheckChatWriterProps {
  chat: ChatData;
  nickname: string;
  subName: string;
}

export const checkChatWriter = ({
  chat,
  nickname,
  subName,
}: CheckChatWriterProps) =>
  chat.nickname === nickname && chat.subName === subName;
