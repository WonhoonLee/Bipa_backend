<!-- src/components/game/UserDataPanel.vue -->
<template>
  <aside class="panel-root" :class="{ minimized }">
    <!-- 헤더: 제목 없이 탭만 유지 -->
    <header class="panel-header">
      <nav class="tabs" role="tablist" aria-label="정보 탭">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-btn"
          :class="{ active: activeTab === index }"
          role="tab"
          :aria-selected="activeTab === index"
          @click="activeTab = index"
        >
          {{ tab }}
        </button>
      </nav>
    </header>

    <!-- 본문 -->
    <section v-show="!minimized" class="panel-body">
      <div class="tab-content" role="tabpanel">
        <!-- 0) 사용자 정보 탭: 사용자 카드 + 캐릭터 상태/액션/기록 -->
        <template v-if="activeTab === 0">
          <Userinfo />

          <!-- 캐릭터 상태 박스 -->
          <div class="box">
            <div class="row">
              <strong>characterId:</strong>
              <span>{{ characterId ?? '-' }}</span>
            </div>
            <div v-if="loading" class="info">캐릭터 불러오는 중…</div>
            <div v-if="errorMsg" class="err">{{ errorMsg }}</div>
            <div v-if="msg" :class="msgType">{{ msg }}</div>
          </div>

          <!-- 액션 버튼 -->
          <div class="actions">
            <button :disabled="sending || !characterId" @click="finishGame('낚시')">🎣 낚시 끝내기</button>
            <button :disabled="sending || !characterId" @click="finishGame('문어잡기')">🐙 문어잡기 끝내기</button>
            <button :disabled="sending || !characterId" @click="finishGame('유달산')">⛰️ 유달산 끝내기</button>
          </div>

          <!-- 기록 -->
          <MiniGameStats :records="records" />
        </template>

        <!-- 1) 가게 검색 -->
        <StoreSearch v-else-if="activeTab === 1" />

        <!-- 2) 도감 -->
        <StoreCollection v-else-if="activeTab === 2" />
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Userinfo from '@/components/game/Userinfo.vue'
import StoreSearch from '@/components/store/StoreSearch.vue'
import StoreCollection from '@/components/store/StoreCollection.vue'
import MiniGameStats from '@/components/game/MiniGameStats.vue'
import { useUser } from '@/store/User'
import { fetchCharacters, postPlayGame } from '@/api/bipa'

/* 부모에서 v-model:minimized 제어 호환 */
const props = defineProps<{ minimized?: boolean }>()
const emit = defineEmits<{ (e: 'update:minimized', value: boolean): void }>()
const minimized = computed({
  get: () => props.minimized ?? false,
  set: (v: boolean) => emit('update:minimized', v),
})

/* 탭 */
const tabs = ['사용자 정보', '가게 검색', '도감']
const activeTab = ref(0)

/* 캐릭터/액션 상태 */
const { user } = useUser()
const characterId = ref<number | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const sending = ref(false)
const msg = ref('')
const msgType = ref<'ok' | 'err' | ''>('')

const records = ref<Record<string, number>>({
  낚시: 0,
  문어잡기: 0,
  유달산: 0,
})

function flash(text: string, type: 'ok' | 'err' = 'ok') {
  msg.value = text
  msgType.value = type
  setTimeout(() => (msg.value = ''), 2000)
}

async function loadCharacter() {
  if (!user.id) return
  loading.value = true
  errorMsg.value = ''
  try {
    const uid = Number(user.id)
    const data = await fetchCharacters(uid)
    const ch = data?.characters
    if (ch?.id) characterId.value = ch.id
  } catch (e: any) {
    errorMsg.value =
      e?.response?.data?.message ?? '캐릭터 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function onMiniGameEnd(result: {
  level: number
  exp: number
  money: number
  hungry_gauge: number
  max_actopus: number
  max_fig: number
  max_yudal: number
  max_fish: number
}) {
  if (!characterId.value) {
    flash('캐릭터 정보가 없습니다.', 'err')
    return
  }
  sending.value = true
  try {
    const payload = { id: characterId.value, ...result }
    await postPlayGame(payload)
    flash('미니게임 결과 저장 완료', 'ok')
  } catch (e: any) {
    flash(e?.response?.data?.message ?? '저장 실패', 'err')
  } finally {
    sending.value = false
  }
}

/* 샘플 버튼 동작 */
function finishGame(kind: '낚시' | '문어잡기' | '유달산') {
  const sample = {
    level: 2,
    exp: 50,
    money: 200,
    hungry_gauge: 95,
    max_actopus: kind === '문어잡기' ? 1 : 0,
    max_fig: 0,
    max_yudal: kind === '유달산' ? 1 : 0,
    max_fish: kind === '낚시' ? 1 : 0,
  }
  onMiniGameEnd(sample)
  records.value[kind] = (records.value[kind] ?? 0) + 1
}

onMounted(loadCharacter)
</script>

<style scoped>
/* ===== 컨테이너 ===== */
.panel-root {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;            /* 부모에서 높이 꽉 채울 때 필요 */
}

/* ===== 헤더(탭만) ===== */
.panel-header {
  position: relative;
  display: block;
  padding: 10px 12px;
  background: #fff2a8;
  border-bottom: 1px solid #f0e3a1;
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 0 0 auto;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e9df9a;
  background: #f9f1bf;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1;
}
.tab-btn.active {
  background: #57c5b6;
  color: #fff;
  border-color: #3daaa0;
}

/* 토글/레일 UI 완전 제거 */
.toggle-btn,
.mini-rail {
  display: none !important;
}

/* ===== 본문 ===== */
.panel-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  min-height: 0;
}

.tab-content {
  /* 안쪽에서만 스크롤되도록 */
  flex: 1 1 auto;
  min-height: 0;
  background: #fff;
  border: 1px solid #eee2a1;
  border-radius: 10px;
  padding: 12px;
  overflow: auto;
}

/* 박스 UI */
.box {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #fafafa;
}
.row { display: flex; gap: 6px; align-items: center; }
.info { color: #666; }
.ok { color: #2f9e44; }
.err { color: #d6336c; }

/* 액션 버튼 */
.actions {
  margin: 12px 0;
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
}
.actions button {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.actions button:hover { background: #f7f7f7; }
.actions button:disabled { opacity: .6; cursor: not-allowed; }
</style>
