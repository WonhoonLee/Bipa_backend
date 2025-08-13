<template>
  <div class="login-page">
    <!-- ✅ 전체 배경 이미지 -->
    <img class="background" src="@/assets/images/full_display.png" alt="배경 이미지" />

    <!-- ✅ 이미지 로고 -->
    <img class="logo" src="@/assets/images/로고.png" alt="게임 첫 화면" />

    <!-- ✅ 시작 버튼 -->
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import api from '@/api/axios'              // ✅ baseURL: http://localhost:8080
import { useUser } from '@/store/User'

const router = useRouter()
const { user, setNickname } = useUser()

async function startGame() {
  // 타입 경고 회피용(프로젝트에 shims-kakao.d.ts 있으면 생략 가능)
  // @ts-ignore
  const Kakao = window.Kakao
  if (!Kakao) {
    console.error('Kakao SDK not loaded')
    return
  }

  Kakao.Auth.login({
    success: () => {
      Kakao.API.request({
        url: '/v2/user/me',
        success: async (res: any) => {
          // ✅ 1) 카카오 사용자 정보 파싱
          const kakaoId = res?.id
          const nickname =
            res?.kakao_account?.profile?.nickname ?? '게스트'
          // 카카오 응답에 connected_at이 없을 수도 있으니 안전하게 보정
          const connectedAt: string = res?.connected_at ?? new Date().toISOString()

          // ✅ 2) Pinia Store 반영
          user.id = kakaoId
          setNickname(nickname)

          // ✅ 3) 백엔드 first_login 호출 (명세에 맞춰 "user" 중첩)
          try {
            await api.post('/user/first_login', {
              user: {
                id: kakaoId,
                nickname,
                connected_at: connectedAt
              }
            })
            console.log('✅ first_login 성공')
          } catch (err) {
            console.error('❌ first_login 실패', err)
            // 실패하더라도 게임화면 진입은 가능하게 두고 싶다면 아래 라우팅 유지
            // return으로 막고 싶으면 여기서 return
          }

          // ✅ 4) 게임 화면으로 이동
          router.push('/game')
        },
        fail: (err: any) => {
          console.error('❌ 사용자 정보 요청 실패', err)
        }
      })
    },
    fail: (err: any) => {
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
  object-position: 85% center; /* 오른쪽을 더 보여줌 */
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
  transition: transform .2s ease-in-out, background-color .2s ease-in-out;
}

.start-btn:hover {
  background-color: #ffde00;
  transform: scale(1.05);
}
</style>
