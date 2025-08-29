<!-- src/components/game/UserDataPanel.vue -->
<template>
  <v-sheet class="panel-root d-flex flex-column h-100" color="#FFF7D6">
    <!-- 탭 헤더 -->
    <v-tabs
      v-model="activeTab"
      bg-color="#FFF2A8"
      density="comfortable"
      grow
      class="px-3"
    >
      <v-tab value="user">사용자 정보</v-tab>
      <v-tab value="search">가게 검색</v-tab>
      <v-tab value="dex">도감</v-tab>
    </v-tabs>

    <!-- 본문 (탭 컨텐츠) -->
    <v-window v-model="activeTab" class="flex-1-1-auto overflow-auto px-3 pb-3">
      <!-- 사용자 정보 -->
      <v-window-item value="user">
        <div class="stack gap-12">
          <!-- 1) 사용자 카드 -->
          <Userinfo class="w-100"/>

          <!-- 2) 미니게임 안내 (오른쪽으로 옮긴 버전) -->
          <MiniGameInfo class="w-100"/>

          <!-- 3) 캐릭터 상태 -->
          <v-card class="w-100" variant="flat" rounded="lg">
            <v-card-text class="py-3">
              <div class="d-flex align-center ga-2">
                <strong>characterId:</strong>
                <span>{{ characterId ?? '-' }}</span>
              </div>

              <div v-if="loading" class="text-medium-emphasis mt-2">캐릭터 불러오는 중…</div>
              <div v-if="errorMsg" class="text-error mt-2">{{ errorMsg }}</div>
              <div v-if="msg" :class="msgType === 'ok' ? 'text-success' : 'text-error'" class="mt-2">
                {{ msg }}
              </div>
            </v-card-text>
          </v-card>

          <!-- 4) 액션 버튼 -->
          <v-card class="w-100" variant="flat" rounded="lg">
            <v-card-text>
              <div class="d-grid ga-2">
                <v-btn
                  color="primary"
                  :disabled="sending || !characterId"
                  @click="finishGame('낚시')"
                  block
                >🎣 낚시 끝내기</v-btn>

                <v-btn
                  color="primary"
                  :disabled="sending || !characterId"
                  @click="finishGame('문어잡기')"
                  block
                >🐙 문어잡기 끝내기</v-btn>

                <v-btn
                  color="primary"
                  :disabled="sending || !characterId"
                  @click="finishGame('유달산')"
                  block
                >⛰️ 유달산 끝내기</v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- 5) 기록 -->
          <MiniGameStats :records="records" class="w-100"/>
        </div>
      </v-window-item>

      <!-- 가게 검색 -->
      <v-window-item value="search">
        <StoreSearch class="w-100"/>
      </v-window-item>

      <!-- 도감 -->
      <v-window-item value="dex">
        <StoreCollection class="w-100"/>
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Userinfo from '@/components/game/Userinfo.vue'
import StoreSearch from '@/components/store/StoreSearch.vue'
import StoreCollection from '@/components/store/StoreCollection.vue'
import MiniGameInfo from '@/components/game/MiniGameInfo.vue'
import MiniGameStats from '@/components/game/MiniGameStats.vue'
import { useUser } from '@/store/User'
import { fetchCharacters, postPlayGame } from '@/api/bipa'

const activeTab = ref<'user' | 'search' | 'dex'>('user')

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
  setTimeout(() => (msg.value = ''), 1800)
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
    errorMsg.value = e?.response?.data?.message ?? '캐릭터 정보를 불러오지 못했습니다.'
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
  if (!characterId.value) return flash('캐릭터 정보가 없습니다.', 'err')
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

function finishGame(kind: '낚시' | '문어잡기' | '유달산') {
  const sample = {
    level: 2, exp: 50, money: 200, hungry_gauge: 95,
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
.panel-root { min-width: 340px; }

/* 스택 유틸 (간격 일정) */
.stack { display: flex; flex-direction: column; }
.gap-12 { gap: 12px; }

/* Vuetify 컴포넌트 폭을 강제로 맞춰줌 */
:deep(.v-card),
:deep(.v-list),
:deep(.v-expansion-panels),
:deep(form) { width: 100%; }

/* 내부 입력/버튼이 쪼개지지 않도록 */
:deep(.v-input), :deep(.v-field) { width: 100%; }
:deep(.v-btn.block) { width: 100%; }

/* 본문 스크롤은 우측 패널 내부에서만 */
.flex-1-1-auto { flex: 1 1 auto; }
.overflow-auto { overflow: auto; }
</style>
