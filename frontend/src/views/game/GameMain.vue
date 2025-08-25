<template>
  <div class="game-main" :class="{ 'is-collapsed': isRightCollapsed }">
    <section class="left">
      <GameViewer />
    </section>

    <aside class="right">
      <!-- 우상단 둥근 '접기' 버튼 -->
      <button
        class="panel-min-btn"
        type="button"
        @click="collapseRight"
        aria-label="오른쪽 패널 접기"
        title="접기"
      >
        ⟨
      </button>

      <div class="status" v-if="loading || errorMsg">
        <span v-if="loading">캐릭터 불러오는 중…</span>
        <template v-else>
          <span class="error">불러오기 실패: {{ errorMsg }}</span>
          <button class="retry" @click="fetchCharacter">다시 시도</button>
        </template>
      </div>

      <UserDataPanel />
    </aside>

    <!-- 최소화 시 오른쪽 중앙의 '펼치기' 버튼 -->
    <button
      v-if="isRightCollapsed"
      class="restore-center-btn"
      type="button"
      @click="expandRight"
      aria-label="오른쪽 패널 펼치기"
      title="펼치기"
    >
      ⟩
    </button>
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

const STORAGE_KEY = 'gm_right_collapsed'
const isRightCollapsed = ref(localStorage.getItem(STORAGE_KEY) === '1')
function collapseRight(){ isRightCollapsed.value = true;  localStorage.setItem(STORAGE_KEY,'1') }
function expandRight(){   isRightCollapsed.value = false; localStorage.setItem(STORAGE_KEY,'0') }

async function fetchCharacter() {
  if (!user.id) { errorMsg.value = '로그인 정보가 없습니다.'; return }
  const uid = Number(user.id); if (!Number.isFinite(uid)) { errorMsg.value = '유효하지 않은 사용자 ID입니다.'; return }
  loading.value = true; errorMsg.value = ''
  try {
    const { data } = await api.post('/user/characters', { user: { id: uid } })
    const ch = data?.characters
    if (ch) {
      if (typeof ch.level === 'number') user.level = ch.level
      if (typeof ch.hungry_gauge === 'number') user.hunger = ch.hungry_gauge
      if (typeof ch.money === 'number') (user as any).money = ch.money
      if (typeof ch.exp === 'number') (user as any).exp = ch.exp
    } else errorMsg.value = '캐릭터 데이터가 비어있습니다.'
  } catch (e:any) {
    console.error('캐릭터 로딩 실패', e?.response?.data || e)
    errorMsg.value = e?.response?.data?.message || e?.message || '알 수 없는 오류'
  } finally { loading.value = false }
}

onMounted(() => {
  if (!user.id) { router.push('/login'); return }
  fetchCharacter()
})

watch(() => user.id, (val, oldVal) => { if (val && val !== oldVal) fetchCharacter() })
</script>

<style scoped>
.game-main{
  position: relative;
  display: grid;
  grid-template-columns: 2fr 1fr;   /* 기본 2:1 */
  height: 100vh;
  min-height: 100vh;
  background: #0f0f0f;
}
.game-main.is-collapsed{ grid-template-columns: 1fr; }

/* 좌/우 영역은 자체 스크롤 */
.left{ background:#111; border-right:1px solid #242424; min-width:0; height:100%; overflow:auto; }
.right{ position:relative; background:#fff9db; min-width:0; height:100%; overflow:auto; padding:12px; }
.game-main.is-collapsed .right{ display:none; }

/* 상태 라인 */
.status{ display:flex; align-items:center; gap:8px; margin-bottom:8px; font-size:14px; }
.status .error{ color:#d6336c; }
.retry{ padding:4px 8px; font-size:12px; border:1px solid #ccc; background:#fff; border-radius:6px; cursor:pointer; }
.retry:hover{ background:#f0f0f0; }

/* 우상단 둥근 '접기' 버튼 */
.panel-min-btn{
  position: sticky; top: 8px; float:right;
  display:grid; place-items:center;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid #e7cf7a;
  background: #fff;
  color:#6b5a2a; font-size: 18px;
  cursor: pointer; z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.panel-min-btn:hover{ background:#fff6cf; }

/* 최소화 시 오른쪽 중앙의 '펼치기' 버튼 */
.restore-center-btn{
  position: fixed; right: 8px; top: 50%; transform: translateY(-50%);
  display:grid; place-items:center;
  width: 46px; height: 46px;
  border-radius: 50%;
  border: 1px solid #e7cf7a;
  background: rgba(255,255,255,.96);
  color:#6b5a2a; font-size: 22px;
  cursor: pointer; z-index: 50;
  box-shadow: 0 6px 18px rgba(0,0,0,.12);
  backdrop-filter: blur(2px);
}
.restore-center-btn:hover{ background:#fff3b0; }

/* 모바일 */
@media (max-width: 960px){
  .game-main{ grid-template-columns:1fr; grid-template-rows:auto auto; height:auto; min-height:100vh; }
  .left, .right{ height:auto; overflow:visible; }
  .right{ border-top:1px solid #f1e6ad; }
}
</style>
