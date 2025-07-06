<template>
  <div class="home">
    <h2>홈 화면입니다</h2>
    <button @click="loginWithKakao">카카오로 로그인</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY

    onMounted(() => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey)
        console.log('✅ Kakao SDK initialized')
      }
    })

    const loginWithKakao = () => {
      window.Kakao.Auth.login({
        success(authObj: any) {
          console.log('✅ 로그인 성공:', authObj)

          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res: any) => {
              console.log('👤 사용자 정보:', res)
              alert(`안녕하세요, ${res.kakao_account.profile.nickname}님!`)
            },
            fail: (err: any) => {
              console.error('❌ 사용자 정보 요청 실패', err)
            }
          })
        },
        fail(err: any) {
          console.error('❌ 로그인 실패:', err)
        }
      })
    }

    return {
      loginWithKakao,
    }
  }
})
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #fee500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
