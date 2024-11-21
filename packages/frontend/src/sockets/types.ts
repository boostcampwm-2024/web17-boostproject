export interface ChatDataType {
  id: number;
  likeCount: number;
  message: string;
  type: string;
  createdAt: Date;
  liked: boolean;
  nickname: string;
}

export interface ChatDataResponse {
  chats?: ChatDataType[];
  hasMore: boolean;
}
