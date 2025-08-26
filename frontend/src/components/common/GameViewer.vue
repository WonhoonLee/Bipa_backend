<!-- src/components/common/GameViewer.vue -->
<template>
  <div class="game-viewer">
    <h2>🕹 게임 화면</h2>

    <!-- Unity WebGL -->
    <div class="frame-wrap">
      <iframe
        class="unity-frame"
        :src="unitySrc"
        title="BipaGame"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write"
        scrolling="no"
      ></iframe>
    </div>

    <!-- 상태 패널 -->
    <div class="panel">
      <div class="row">
        <strong>characterId:</strong>
        <span>{{ characterId ?? '-' }}</span>
      </div>
      <div v-if="loading" class="info">캐릭터 불러오는 중…</div>
      <div v-if="errorMsg" class="err">{{ errorMsg }}</div>
      <div v-if="msg" :class="msgType">{{ msg }}</div>
    </div>

    <div class="actions">
      <button :disabled="sending || !characterId" @click="finishGame('낚시')">🎣 낚시 끝내기(샘플)</button>
      <button :disabled="sending || !characterId" @click="finishGame('문어잡기')">🐙 문어잡기 끝내기(샘플)</button>
      <button :disabled="sending || !characterId" @click="finishGame('유달산')">⛰️ 유달산 끝내기(샘플)</button>
    </div>

    <MiniGameStats :records="records" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MiniGameStats from '@/components/game/MiniGameStats.vue'
import { useUser } from '@/store/User'
import { fetchCharacters, postPlayGame } from '@/api/bipa'

const { user } = useUser()

// public/unity/BipaGame/index.html
const unitySrc = '/unity/BipaGame/index.html'

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
  const uid = Number(user.id)
  if (!Number.isFinite(uid)) { errorMsg.value = '유효하지 않은 사용자 ID'; return }

  loading.value = true
  errorMsg.value = ''
  try {
    const data = await fetchCharacters(uid)
    const ch = data?.characters
    if (ch?.id) characterId.value = ch.id
  } catch (e: any) {
    console.error('[characters error]', e?.response?.data ?? e)
    errorMsg.value = e?.response?.data?.message ?? '캐릭터 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function onMiniGameEnd(result: {
  level: number; exp: number; money: number; hungry_gauge: number;
  max_actopus: number; max_fig: number; max_yudal: number; max_fish: number;
}) {
  if (!characterId.value) { flash('캐릭터 정보가 없습니다.', 'err'); return }
  sending.value = true
  try {
    const payload = { id: characterId.value, ...result }
    await postPlayGame(payload)
    flash('미니게임 결과 저장 완료', 'ok')
  } catch (e: any) {
    console.error('[play_game error]', e?.response?.data ?? e)
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
.game-viewer {
  padding: 1rem;
  background: #f0f0f0;
  height: 100%;
}

/* ===============================
   16:9 비율 유지 + 레터박스 표시
   =============================== */
.frame-wrap{
  position: relative;
  width: 100%;
  /* 16:9 비율을 브라우저가 지원하면 이 한 줄로 끝 */
  aspect-ratio: 16 / 9;

  /* 구형 브라우저 fallback (aspect-ratio 미지원 대비) */
  /* padding-top: 56.25%;  height: 0; */

  /* 세로가 너무 커지지 않게 한도 */
  max-height: 80vh;

  /* aspect-ratio가 적용돼 height:auto가 되므로,
     최대 높이를 넘을 땐 letter-box(상하 여백) 생김 */
  background: #000;
  border-radius: 10px;
  overflow: hidden;            /* 프레임 바깥 스크롤 차단 */
  border: 1px dashed #c7c7c7;
}

/* 구형 브라우저 fallback용(위 padding-top 사용시만)
.frame-wrap > .unity-frame {
  position: absolute;
  inset: 0;
}
*/

.unity-frame{
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;            /* 일부 브라우저 내부 스크롤 숨김 */
}

/* 이하 동일 */
.panel{
  background:#fff; border:1px solid #e5e5e5; border-radius:6px;
  padding:8px; margin-top:12px; margin-bottom:8px; font-size:14px;
}
.panel .row{ display:flex; gap:6px; align-items:center; }
.info{ color:#555; }
.ok{ color:#2f9e44; }
.err{ color:#d6336c; }
.actions{ display:flex; gap:8px; margin-bottom:10px; }
.actions button{
  padding:8px 10px; border:1px solid #ccc; background:#fff;
  cursor:pointer; border-radius:6px;
}
.actions button:disabled{ opacity:.6; cursor:not-allowed; }
.actions button:hover:not(:disabled){ background:#f4f4f4; }
</style>
