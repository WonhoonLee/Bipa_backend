<template>
  <div class="login-page">
    <!-- ✅ 전체 배경 이미지 -->
    <img class="background" src="@/assets/images/full_display.png" alt="배경 이미지" />

    <!-- ✅ 이미지 로고 삽입 -->
    <img class="logo" src="@/assets/images/로고.png" alt="게임 첫 화면" />
    
    <!-- ✅ 게임 시작 버튼 -->
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUser } from '@/store/User'

const router = useRouter()
const { user, setNickname } = useUser()

function startGame() {
  window.Kakao.Auth.login({
    success: function (authObj: any) {
      console.log('✅ 로그인 성공', authObj)

      // ✅ 카카오 API로 사용자 정보 요청
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res: any) => {
          console.log('✅ 사용자 정보', res)

          // ✅ 로그인 시 user store 갱신
          user.id = res.id
          setNickname(res.kakao_account.profile.nickname) // store + localStorage

          router.push('/game') // ✅ 게임 화면으로 이동
        }
      })
    },
    fail: function (err: any) {
      console.error('❌ 로그인 실패', err)
    }
  })
}
</script>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

/* ✅ 배경 이미지 (오른쪽 대교 강조) */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 85% center; 
  z-index: -1;
}

/* ✅ 로고 */
.logo {
  width: 400px;  
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 12px rgba(0,0,0,0.5));
}

/* ✅ 시작 버튼 */
.start-btn {
  background-color: #FEE500;
  border: none;
  padding: 18px 36px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.start-btn:hover {
  background-color: #ffde00;
  transform: scale(1.05);
  transition: all 0.2s ease-in-out;
}
</style>
