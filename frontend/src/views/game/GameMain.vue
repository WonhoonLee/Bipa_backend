<template>
  <div class="game-main">
    <GameViewer class="left" />

    <div class="right">
      <!-- 상단 상태 표시 (선택) -->
      <div class="status" v-if="loading || errorMsg">
        <span v-if="loading">캐릭터 불러오는 중…</span>
        <span v-else class="error">불러오기 실패: {{ errorMsg }}</span>
      </div>

      <UserDataPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GameViewer from '@/components/common/GameViewer.vue'
import UserDataPanel from '@/components/game/UserDataPanel.vue'
import api from '@/api/axios'
import { useUser } from '@/store/User'

const router = useRouter()
const { user } = useUser()

const loading = ref(false)
const errorMsg = ref('')

async function fetchCharacter() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await api.post('/user/characters', {
      user: { id: user.id }
    })
    const ch = res.data?.characters
    if (ch) {
      // 백엔드 응답 키에 맞춰 매핑 (있을 때만 덮어쓰기)
      if (typeof ch.level === 'number') user.level = ch.level
      if (typeof ch.hungry_gauge === 'number') user.hunger = ch.hungry_gauge
      if (typeof ch.money === 'number') (user as any).money = ch.money
      if (typeof ch.exp === 'number') (user as any).exp = ch.exp
      // 필요 시 추가 필드도 반영 (max_fig, max_fish 등)
    }
  } catch (e: any) {
    console.error('캐릭터 로딩 실패', e)
    errorMsg.value = e?.response?.data?.message || e?.message || '알 수 없는 오류'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 로그인 정보 없으면 되돌리기
  if (!user.id) {
    router.push('/login')
    return
  }
  // 캐릭터 정보 로딩
  fetchCharacter()
})
</script>

<style scoped>
.game-main {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.left {
  flex: 2;
  background-color: #111; /* 미니게임 자리 */
}

.right {
  flex: 1;
  background-color: #fff9db;
  padding: 1rem;
  overflow-y: auto;
  height: 100vh;
}

/* 선택: 상단 로딩/오류 표시 */
.status {
  margin-bottom: 8px;
  font-size: 14px;
}
.status .error {
  color: #d6336c;
}
</style>
