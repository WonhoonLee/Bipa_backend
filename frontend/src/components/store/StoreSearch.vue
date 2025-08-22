<!-- src/components/store/StoreSearch.vue -->
<template>
  <div class="store-search">
    <h2>🏪 가게 검색</h2>

    <!-- 🔎 [분류] [검색어] [조회] 한 줄 고정 -->
    <div class="filters">
      <select v-model="division" class="select" aria-label="분류 선택">
        <option value="all">전체</option>
        <option value="cafe">카페</option>
        <option value="restaurant">음식점</option>
        <option value="tour">관광</option>
      </select>

      <input
        v-model="keyword"
        type="text"
        class="keyword"
        placeholder="검색어를 입력하세요"
        @keyup.enter="fetch"
        aria-label="검색어 입력"
      />

      <button class="query-btn" :disabled="loading" @click="fetch" title="조회" aria-label="조회">
        🔍
      </button>
    </div>

    <!-- 상태 -->
    <div v-if="loading" class="loading">⏳ 불러오는 중…</div>
    <div v-else-if="msg" class="msg">{{ msg }}</div>

    <!-- 결과/상세 -->
    <div v-else class="grid">
      <div class="results">
        <div v-if="results.length === 0" class="no-results">검색 결과가 없습니다.</div>

        <div
          v-for="p in results"
          :key="p.place_name + (p.address || '')"
          class="place-card"
          @click="openPlaceDetail(p.place_name)"
          role="button"
          tabindex="0"
          @keypress.enter="openPlaceDetail(p.place_name)"
        >
          <img
            v-if="p.image_url"
            :src="Array.isArray(p.image_url) ? p.image_url[0] : p.image_url"
            alt="가게 이미지"
            loading="lazy"
          />
          <div class="info">
            <h3 class="name">
              {{ p.place_name }}
              <small v-if="p.category" class="badge">#{{ displayCategory(p.category) }}</small>
            </h3>
            <p v-if="p.address" class="addr">{{ p.address }}</p>
          </div>
        </div>
      </div>

      <div class="detail">
        <h3>상세</h3>
        <div v-if="selected">
          <h2 class="title">
            {{ selected.place_name }}
            <small v-if="selected.category">({{ displayCategory(selected.category) }})</small>
          </h2>
          <p v-if="selected.address" class="addr">{{ selected.address }}</p>
          <p v-if="selected.business_hours">영업시간: {{ selected.business_hours }}</p>
          <h4 v-if="Array.isArray(selected.menu) && selected.menu.length">메뉴</h4>
          <ul v-if="Array.isArray(selected.menu)">
            <li v-for="m in selected.menu" :key="m">{{ m }}</li>
          </ul>
        </div>
        <div v-else class="muted">왼쪽에서 장소를 선택하세요</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import api from '@/api/axios'
import { useUser } from '@/store/User'

type Division = 'all' | 'cafe' | 'restaurant' | 'tour'
type UIPlace = { place_name: string; address?: string; image_url?: string | string[]; category?: string }

const { user } = useUser()

const division = ref<Division>('all')
const keyword  = ref('')
const results  = ref<UIPlace[]>([])
const selected = ref<any>(null)
const loading  = ref(false)
const msg      = ref('')

// 카테고리 라벨 표시
function displayCategory(raw?: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('cafe')) return '카페'
  if (s.includes('restaurant')) return '음식점'
  if (s.includes('tour')) return '관광'
  return raw || ''
}

// 검색
async function loadSearchPlace() {
  const body: any = { search: (keyword.value || '') }
  if (division.value !== 'all') body.division = division.value

  const uid = Number((user as any).id)
  if (uid) body.user = { user_id: uid }

  const { data } = await api.post('/place/search_place', body)

  results.value = (data?.results ?? []).map((it: any) => ({
    place_name: it.place_name,
    address: it.address,
    image_url: it.image_url,
    category: it.category
  }))
  selected.value = null
}

async function openPlaceDetail(name: string) {
  loading.value = true
  msg.value = ''
  try {
    const { data } = await api.post('/place/select_place', { place: { place_name: name } })
    selected.value = data?.place ?? null
  } catch (e: any) {
    console.error('❌ 상세 실패:', e?.response?.data ?? e)
    selected.value = null
    msg.value = e?.response?.data?.message ?? '상세 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function fetch() {
  loading.value = true
  msg.value = ''
  try {
    await loadSearchPlace()
    if (results.value.length === 0) msg.value = '검색 결과가 없습니다.'
  } catch (e: any) {
    console.error('❌ 조회 실패:', e?.response?.data ?? e)
    results.value = []
    selected.value = null
    msg.value = e?.response?.data?.message ?? '조회에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

// 분류 바꾸면 자동 조회
watch(division, fetch)
// 첫 화면 자동 조회(전체 + 빈 키워드)
onMounted(fetch)
</script>

<style scoped>
.store-search { padding: 1rem; background: #fffbe6; border-radius: 12px; border: 1px solid #f2e7a1; }

/* ===== 필터 바: 한 줄 강제, 버튼은 고정 폭 ===== */
.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;        /* 줄바꿈 금지 */
  margin-bottom: 12px;
}
.select {
  flex: 0 0 128px;          /* 고정 폭 */
  padding: 8px 10px;
  border: 1px solid #e5e5e5; border-radius: 8px; background: #fff;
}
.keyword {
  flex: 1 1 auto;           /* 남는 공간을 입력창이 먹음 */
  min-width: 160px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5; border-radius: 8px; background: #fff;
}
.query-btn {
  flex: 0 0 44px;           /* 버튼 고정 폭 → 절대 아래로 안 내려감 */
  height: 40px;
  border: 1px solid #e5e5e5; border-radius: 8px; background: #fff; cursor: pointer;
}

/* 상태 */
.loading, .msg { padding: 10px 12px; background: #fff; border: 1px dashed #e5e5e5; border-radius: 8px; }

/* 리스트/상세 */
.grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 12px; }
@media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }

.results { display: flex; flex-direction: column; gap: 10px; }
.no-results { color: #777; }

.place-card {
  display: flex; gap: 10px; align-items: center;
  padding: 10px; background: #fff; border: 1px solid #eee2a8; border-radius: 10px;
  cursor: pointer; transition: box-shadow .15s ease, transform .05s ease;
}
.place-card:hover { box-shadow: 0 6px 14px rgba(0,0,0,.08); transform: translateY(-1px); }
.place-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; background: #f7f7f7; }
.place-card .name { margin: 0 0 4px; font-size: 16px; display: flex; gap: 6px; align-items: center; }
.place-card .badge { font-size: 12px; color: #8a6d00; background: #fff7cc; padding: 2px 6px; border-radius: 6px; }
.place-card .addr { margin: 0; color: #666; font-size: 13px; }

.detail { padding: 12px; background: #fffdf1; border: 1px solid #f0e2a0; border-radius: 10px; min-height: 160px; }
.detail .title { margin: 4px 0 8px; }
.detail .muted { color: #888; font-size: 14px; }
</style>
