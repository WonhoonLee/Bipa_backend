<template>
  <div class="kakao-login">
    <button @click="loginWithKakao">카카오로 로그인</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const KAKAO_JS_KEY = '9b22db9e138ccb1acbcb06339e23bca5'

// ✅ Kakao 사용자 응답 타입
interface KakaoAccount {
  profile: {
    nickname: string
    profile_image_url?: string
    thumbnail_image_url?: string
  }
  email?: string
}

interface KakaoUserResponse {
  id: number
  kakao_account: KakaoAccount
  connected_at?: string
  properties?: Record<string, unknown>
}

onMounted(() => {
  if (typeof window.Kakao !== 'undefined' && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY)
    console.log('✅ Kakao SDK initialized')
  }
})

function loginWithKakao() {
  if (!window.Kakao) {
    console.error('❌ Kakao SDK 로드 안됨')
    return
  }

  window.Kakao.Auth.login({
    success(_authObj: unknown) {
      console.log('✅ 로그인 성공')

      window.Kakao.API.request({
        url: '/v2/user/me',
        success(response: KakaoUserResponse) {
          const nickname = response.kakao_account.profile.nickname
          alert(`환영합니다, ${nickname}님!`)
          router.push('/')
        },
        fail(error: unknown) {
          console.error('❌ 사용자 정보 요청 실패:', error)
        }
      })
    },
    fail(err: unknown) {
      console.error('❌ 로그인 실패:', err)
    }
  })
}
</script>

<style scoped>
button {
  background-color: #fee500;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
</style>
