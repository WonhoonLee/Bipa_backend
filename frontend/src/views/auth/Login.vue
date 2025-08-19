<template>
  <div class="login-page">
    <!-- 전체 배경 이미지 -->
    <img class="background" src="@/assets/images/full_display.png" alt="배경 이미지" />

    <!-- 이미지 로고 -->
    <img class="logo" src="@/assets/images/로고.png" alt="게임 첫 화면" />

    <!-- 시작 버튼 -->
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import api from '@/api/axios'            // baseURL: http://localhost:8080
import { useUser } from '@/store/User'

declare global { interface Window { Kakao: any } }

const router = useRouter()
const { user, setNickname } = useUser()

async function startGame() {
  const Kakao = window.Kakao
  if (!Kakao) { console.error('Kakao SDK not loaded'); return }

  try {
    // 1) 카카오 로그인 (PC 브라우저에서 톡앱 스킴 방지)
    await new Promise<void>((resolve, reject) => {
      Kakao.Auth.login({
        scope: 'profile_nickname',
        throughTalk: false, // ← intent: 스킴 방지
        success: () => resolve(),
        fail: (err: any) => {
          console.warn('[Kakao.Auth.login fail]', err)
          Kakao.Auth.loginForm({
            scope: 'profile_nickname',
            success: () => resolve(),
            fail: (e: any) => reject(e),
          })
        },
      })
    })

    // 2) 사용자 정보 요청
    const me = await Kakao.API.request({ url: '/v2/user/me' })
    const kakaoId: number = me?.id
    const kakaoNickname: string = me?.kakao_account?.profile?.nickname ?? '게스트'

    // 닉변 유지: 저장된 닉넴이 있으면 그걸 우선 사용
    const savedNickname = localStorage.getItem('nickname')
    const nicknameToUse = savedNickname && savedNickname.trim().length
      ? savedNickname.trim()
      : kakaoNickname

    // LocalDateTime 호환 ("YYYY-MM-DDTHH:mm:ss")
    const connectedAt: string = (me?.connected_at ?? new Date().toISOString()).slice(0, 19)

    // 3) 서버 first_login 호출 (루트 키: user)
    const { status, data } = await api.post('/user/first_login', {
      user: { id: kakaoId, nickname: nicknameToUse, connected_at: connectedAt },
    })
    console.log('[first_login status]', status)
    console.log('[first_login data]', JSON.stringify(data, null, 2))

    // 4) 스토어/로컬 반영
    if (data?.status === 'success' && typeof data.id !== 'undefined') {
      user.id = data.id
    } else {
      user.id = kakaoId // 서버가 id를 안주면 카카오 id로 폴백
    }
    setNickname(nicknameToUse)
    localStorage.setItem('nickname', nicknameToUse)

    // 5) 게임 화면으로 이동
    router.push('/game')
  } catch (err) {
    console.error('로그인/first_login 실패', err)
  }
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

/* 배경 이미지 */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 85% center; /* 오른쪽 강조 */
  z-index: -1;
}

/* 로고 */
.logo {
  width: 400px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 12px rgba(0,0,0,0.5));
}

/* 시작 버튼 */
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
