<template>
  <div class="login-page">
    <img class="background" src="@/assets/images/full_display.png" alt="배경 이미지" />
    <img class="logo" src="@/assets/images/로고.png" alt="게임 첫 화면" />
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useUser } from '@/store/User'

declare global { interface Window { Kakao: any } }

const router = useRouter()
const { user, setNickname } = useUser()

async function startGame() {
  const Kakao = window.Kakao
  if (!Kakao) { console.error('Kakao SDK not loaded'); return }

  try {
    // 카카오 로그인 (톡앱 스킴 방지 + 폴백)
    await new Promise<void>((resolve, reject) => {
      Kakao.Auth.login({
        scope: 'profile_nickname',
        throughTalk: false,
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

    // 사용자 정보
    const me = await Kakao.API.request({ url: '/v2/user/me' })
    const kakaoId: number = me?.id
    const kakaoNickname: string = me?.kakao_account?.profile?.nickname ?? '게스트'

    // 저장된 닉넴 우선
    const savedNickname = localStorage.getItem('nickname')
    const nicknameToUse = savedNickname && savedNickname.trim().length
      ? savedNickname.trim()
      : kakaoNickname

    const connectedAt: string = (me?.connected_at ?? new Date().toISOString()).slice(0, 19)

    // 최초 로그인 호출
    const { status, data } = await api.post('/user/first_login', {
      user: { id: kakaoId, nickname: nicknameToUse, connected_at: connectedAt },
    })
    console.log('[first_login status]', status)
    console.log('[first_login data]', JSON.stringify(data, null, 2))

    // ID를 숫자로 고정 저장 (타입 경고/호환 방지)
    const resolvedId = (typeof data?.id !== 'undefined') ? data.id : kakaoId
    user.id = Number(resolvedId)

    setNickname(nicknameToUse)
    localStorage.setItem('nickname', nicknameToUse)

    router.push('/game')
  } catch (err) {
    console.error('로그인/first_login 실패', err)
  }
}
</script>

<style scoped>
.login-page { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
.background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: 85% center; z-index: -1; }
.logo { width: 400px; margin-bottom: 40px; position: relative; z-index: 1; filter: drop-shadow(0 0 12px rgba(0,0,0,0.5)); }
.start-btn { background-color: #FEE500; border: none; padding: 18px 36px; font-size: 24px; font-weight: bold; border-radius: 10px; cursor: pointer; position: relative; z-index: 1; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform .2s ease-in-out, background-color .2s ease-in-out; }
.start-btn:hover { background-color: #ffde00; transform: scale(1.05); }
</style>
