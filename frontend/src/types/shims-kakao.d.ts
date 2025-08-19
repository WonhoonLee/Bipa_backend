// 전역 선언용: 이 파일은 어느 곳에서도 import 하지 않음.
export {}

declare global {
  interface Window {
    Kakao: KakaoSDK
  }
}

interface KakaoSDK {
  init(apiKey: string): void
  isInitialized(): boolean
  Auth: {
    login(options: {
      success: (authObj: any) => void
      fail?: (err: any) => void
      scope?: string          // 예: "profile_nickname"
      throughTalk?: boolean
      persistAccessToken?: boolean
      [key: string]: any      // SDK 옵션 확장 대비
    }): void
    logout(callback?: () => void): void
    getAccessToken?: () => string | null
  }
  API: {
    request(options: {
      url: string
      data?: any
      success: (res: any) => void
      fail?: (err: any) => void
      [key: string]: any      // SDK 옵션 확장 대비
    }): void
  }
}
