export const OauthType = {
  GOOGLE: 'google',
  NAVER: 'naver',
  KAKAO: 'kakao',
  LOCAL: 'local',
} as const;

export type OauthType = (typeof OauthType)[keyof typeof OauthType];
