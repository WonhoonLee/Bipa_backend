<template>
  <div class="login-page">
    <h2>로그인</h2>

    <!-- ✅ 이메일 입력 -->
    <input v-model="email" type="email" placeholder="이메일 입력" />

    <!-- ✅ 비밀번호 입력 -->
    <input v-model="password" type="password" placeholder="비밀번호 입력" />

    <!-- ✅ 로그인 버튼 -->
    <button @click="emailLogin">로그인</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ 이메일/비밀번호 상태
const email = ref('')
const password = ref('')

// ✅ Kakao Auth 타입 정의 (카카오 API 유지용)
interface KakaoAuthObj {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
  scope?: string
  token_type: string
}

// ✅ 이메일/비밀번호 로그인 함수 (UI에서 실행됨)
function emailLogin() {
  if (email.value.trim() && password.value.trim()) {
    console.log('✅ 이메일 로그인 성공:', email.value)
    // ➡️ 실제 서버 연동 시 로그인 API 호출 코드 들어갈 자리

    // 임시로 로그인 성공 처리 후 GameMain.vue로 이동
    router.push('/game')
  } else {
    alert('이메일과 비밀번호를 입력해주세요.')
  }
}

// ✅ Kakao 로그인 함수 (버튼은 숨겼지만, API는 유지)
function loginWithKakao() {
  window.Kakao.Auth.login({
    success(authObj: KakaoAuthObj) {
      console.log('카카오 로그인 성공', authObj)
      // ➡️ 카카오 로그인 후 처리 (토큰 저장 등)
      router.push('/game')
    },
    fail(err: unknown) {
      console.error('카카오 로그인 실패', err)
    }
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 100px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input {
  margin-bottom: 12px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
