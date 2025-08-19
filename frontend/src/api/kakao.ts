// src/api/kakao.ts
export function kakaoLogin(): Promise<any> {
  return new Promise((resolve, reject) => {
    window.Kakao.Auth.login({
      success: (authObj: any) => resolve(authObj),
      fail: (err: any) => reject(err),
    });
  });
}

export function getKakaoUserInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    window.Kakao.API.request({
      url: '/v2/user/me',
      success: (res: any) => resolve(res),
      fail: (err: any) => reject(err),
    });
  });
}
