import { GoogleAuthService } from '@/auth/googleAuth.service';
import { OauthUserInfo } from '@/auth/passport/google.strategy';
import { OauthType } from '@/user/domain/ouathType';
import { Role } from '@/user/domain/role';
import { User } from '@/user/domain/user.entity';
import { UserService } from '@/user/user.service';

describe('GoogleAuthService 테스트', () => {
  const userInfo: OauthUserInfo = {
    type: OauthType.GOOGLE,
    givenName: 'Homer Jay',
    familyName: 'Simpson',
    email: 'tester@naver.com',
    oauthId: '12345678910',
  };

  test('oauthId와 type에 맞는 유저가 있으면 해당 객체를 반환한다.', async () => {
    const user: User = {
      id: 1,
      role: Role.USER,
      type: OauthType.GOOGLE,
      isLight: true,
    };
    const userService: Partial<UserService> = {
      findUserByOauthIdAndType: jest.fn().mockResolvedValue(user),
    };
    const authService = new GoogleAuthService(userService as UserService);

    const authUser = await authService.attemptAuthentication(userInfo);

    expect(authUser).toBe(user);
  });

  test('자동 회원가입시 이메일이 없으면 예외가 발생한다.', async () => {
    const userInfo: OauthUserInfo = {
      type: OauthType.GOOGLE,
      givenName: 'Homer Jay',
      familyName: 'Simpson',
      oauthId: '12345678910',
    };
    const userService: Partial<UserService> = {
      findUserByOauthIdAndType: jest.fn().mockResolvedValue(null),
    };
    const authService = new GoogleAuthService(userService as UserService);

    await expect(() =>
      authService.attemptAuthentication(userInfo),
    ).rejects.toThrow('email is required');
  });

  test('자동 회원가입시 givenName과 FamilyName이 없으면 예외가 발생한다.', async () => {
    const userInfo: OauthUserInfo = {
      type: OauthType.GOOGLE,
      email: 'tester@naver.com',
      oauthId: '12345678910',
    };
    const userService: Partial<UserService> = {
      findUserByOauthIdAndType: jest.fn().mockResolvedValue(null),
    };
    const authService = new GoogleAuthService(userService as UserService);

    await expect(() =>
      authService.attemptAuthentication(userInfo),
    ).rejects.toThrow('name is required');
  });

  test.each([
    ['Homer Jay', 'Simpson', 'Homer Jay Simpson'],
    ['Homer Jay', undefined, 'Homer Jay'],
    [undefined, 'Simpson', 'Simpson'],
  ])(
    '이름을 자동 생성 후 가입한다.',
    async (givenName, familyName, expected) => {
      const userInfo: OauthUserInfo = {
        type: OauthType.GOOGLE,
        givenName,
        familyName,
        email: 'tester@naver.com',
        oauthId: '12345678910',
      };
      const userService: Partial<UserService> = {
        findUserByOauthIdAndType: jest.fn().mockResolvedValue(null),
        register: jest.fn(),
      };
      const authService = new GoogleAuthService(userService as UserService);

      await authService.attemptAuthentication(userInfo);

      expect(userService.register).toHaveBeenCalledWith({
        type: userInfo.type,
        nickname: expected,
        email: userInfo.email,
        oauthId: userInfo.oauthId,
      });
    },
  );
});
