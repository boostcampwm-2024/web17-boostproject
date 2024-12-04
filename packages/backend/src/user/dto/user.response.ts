import { ApiProperty } from '@nestjs/swagger';
import { OauthType } from '@/user/domain/ouathType';
import { User } from '@/user/domain/user.entity';

interface UserResponse {
  nickname: string;
  subName: string;
  createdAt: Date;
}

export class UserSearchResult {
  @ApiProperty({
    description: '유저 검색 결과',
    example: [
      {
        nickname: 'nickname',
        subName: 'subName',
        createdAt: new Date(),
      },
    ],
  })
  result: UserResponse[];

  constructor(users: User[]) {
    this.result = users.map((user) => ({
      nickname: user.nickname,
      subName: user.subName,
      createdAt: user.date.createdAt,
    }));
  }
}

export class UserInformationResponse {
  @ApiProperty({
    description: '유저 닉네임',
    example: 'nickname',
  })
  nickname: string;

  @ApiProperty({
    description: '유저 서브 닉네임',
    example: 'subName',
  })
  subName: string;

  @ApiProperty({
    description: '유저 생성일',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '유저 이메일',
    example: 'test@nav.com',
  })
  email: string;

  @ApiProperty({
    description: '유저타입 (google: 구글 로그인, local: 테스터)',
    example: new Date(),
  })
  type: OauthType;

  constructor(user: User) {
    this.nickname = user.nickname;
    this.subName = user.subName;
    this.createdAt = user.date.createdAt;
    this.email = user.email;
    this.type = user.type;
  }
}
