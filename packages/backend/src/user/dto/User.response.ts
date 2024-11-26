import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/user/domain/user.entity';

interface UserResponse {
  id: number;
  nickname: string;
  subName: string;
  createdAt: Date;
}

export class UserSearchResult {
  @ApiProperty({
    description: '유저 검색 결과',
    example: [
      {
        id: 1,
        nickname: 'nickname',
        subName: 'subName',
        createdAt: new Date(),
      },
    ],
  })
  result: UserResponse[];

  constructor(users: User[]) {
    this.result = users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      subName: user.subName,
      createdAt: user.date.createdAt,
    }));
  }
}
