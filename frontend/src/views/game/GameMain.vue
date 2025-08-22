<template>
  <div class="game-main">
    <GameViewer class="left" />

    <div class="right">
      <!-- 상단 상태 표시 -->
      <div class="status" v-if="loading || errorMsg">
        <span v-if="loading">캐릭터 불러오는 중…</span>
        <span v-else class="error">불러오기 실패: {{ errorMsg }}</span>
        <button v-if="!loading" class="retry" @click="fetchCharacter">다시 시도</button>
      </div>

      <UserDataPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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
  // id 없으면 종료
  if (!user.id) {
    errorMsg.value = '로그인 정보가 없습니다.'
    return
  }

  // ✅ 숫자로 고정 (string | number 대응)
  const uid = Number(user.id)
  if (!Number.isFinite(uid)) {
    errorMsg.value = '유효하지 않은 사용자 ID입니다.'
    return
  }

  loading.value = true
  errorMsg.value = ''
  try {
    const resp = await api.post('/user/characters', { user: { id: uid } })
    console.log('[characters status]', resp.status)
    console.log('[characters data]', JSON.stringify(resp.data, null, 2))

    const ch = resp.data?.characters
    if (ch) {
      // 백엔드 응답 키에 맞춰 매핑
      if (typeof ch.level === 'number') user.level = ch.level
      if (typeof ch.hungry_gauge === 'number') user.hunger = ch.hungry_gauge
      if (typeof ch.money === 'number') (user as any).money = ch.money
      if (typeof ch.exp === 'number') (user as any).exp = ch.exp
      // 필요 시: max_fig / max_fish 등 추가
    } else {
      errorMsg.value = '캐릭터 데이터가 비어있습니다.'
    }
  } catch (e: any) {
    console.error('캐릭터 로딩 실패', e?.response?.data || e)
    errorMsg.value =
      e?.response?.data?.message || e?.message || '알 수 없는 오류'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 로그인 정보 없으면 로그인 화면으로
  if (!user.id) {
    router.push('/login')
    return
  }
  fetchCharacter()
})

// id가 늦게 들어오는 경우 자동 재시도
watch(
  () => user.id,
  (val, oldVal) => {
    if (val && val !== oldVal) fetchCharacter()
  }
)
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

/* 상단 로딩/오류 표시 */
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}
.status .error {
  color: #d6336c;
}
.retry {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.retry:hover { background: #f2f2f2; }
</style>
