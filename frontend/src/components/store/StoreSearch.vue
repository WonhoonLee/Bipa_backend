<!-- src/components/store/StoreSearch.vue -->
<template>
  <div class="store-search">
    <!-- ===== 필터 ===== -->
    <div class="filters">
      <!-- 분류 -->
      <select v-model="division" class="select" aria-label="분류 선택">
        <option value="all">전체</option>
        <option value="cafe">카페</option>
        <option value="restaurant">음식점</option>
        <option value="tour">관광</option>
      </select>

      <!-- 검색 -->
      <div class="searchbox">
        <input
          v-model="keyword"
          type="text"
          class="keyword"
          placeholder="검색어를 입력하세요"
          @keyup.enter="fetch"
          autocomplete="off"
          aria-label="검색어 입력"
        />
        <button
          class="search-btn"
          :disabled="loading"
          @click="fetch"
          type="button"
          aria-label="조회"
          title="검색"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <!-- 정렬 (항상 보임, 좁으면 다음 줄로 자동 이동) -->
      <label class="sort">
        <span class="sort__label">정렬</span>
        <select v-model="sortKey" class="sort__select" aria-label="정렬">
          <option value="name">이름</option>
          <option value="distance">거리</option>
          <option value="rating">평점</option>
        </select>
      </label>
    </div>

    <!-- ===== 상태 ===== -->
    <div v-if="loading || msg" class="state state--box">
      <template v-if="loading">⏳ 불러오는 중…</template>
      <template v-else>{{ msg }}</template>
    </div>

    <!-- ===== 결과 ===== -->
    <div v-if="!loading" class="results-wrap">
      <div class="results-meta">
        <span>총 {{ total || results.length }}곳</span>
      </div>

      <ul class="grid">
        <li v-for="p in sorted" :key="rowKey(p)" class="grid__item">
          <button
            class="card"
            type="button"
            @click="openPlaceDetail(p.place_name)"
            @keypress.enter="openPlaceDetail(p.place_name)"
            :title="p.place_name"
          >
            <!-- 이미지 -->
            <div class="card__img-wrap">
              <img
                :src="previewImage(p.image_url)"
                class="card__img"
                alt="가게 이미지"
                loading="lazy"
                @error="onImgError"
              />
              <div class="card__tags" v-if="p.category">
                <span class="tag">#{{ displayCategory(p.category) }}</span>
              </div>
            </div>

            <!-- 본문 -->
            <div class="card__body">
              <h3 class="card__title clamp-2">{{ p.place_name }}</h3>
              <p v-if="p.address" class="card__sub clamp-2">{{ p.address }}</p>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <!-- ===== 상세 오버레이 ===== -->
    <transition name="slide-over">
      <aside v-if="detailOpen" class="overlay" role="dialog" aria-modal="true">
        <div class="overlay__backdrop" @click="closeDetail"></div>
        <div class="panel" role="document">
          <header class="panel__header">
            <h3 class="panel__title">{{ selected?.place_name || '상세' }}</h3>
            <button class="icon-btn" type="button" @click="closeDetail" aria-label="닫기">✕</button>
          </header>

          <div class="panel__content">
            <img
              :src="previewImage(selected?.image_url)"
              class="panel__img"
              alt=""
              @error="onImgError"
            />
            <div class="panel__tags" v-if="selected?.category">
              <span class="tag">#{{ displayCategory(selected!.category) }}</span>
            </div>

            <dl class="detail">
              <div class="detail__row" v-if="selected?.address">
                <dt class="detail__dt">주소</dt>
                <dd class="detail__dd">{{ selected.address }}</dd>
              </div>

              <div class="detail__row" v-if="selected?.business_hours">
                <dt class="detail__dt">영업시간</dt>
                <dd class="detail__dd">{{ selected.business_hours }}</dd>
              </div>

              <div class="detail__row" v-if="Array.isArray(selected?.menu) && selected!.menu.length">
                <dt class="detail__dt">메뉴</dt>
                <dd class="detail__dd">
                  <ul class="menu">
                    <li v-for="m in selected!.menu" :key="menuKey(m)" class="menu__row">
                      <span class="menu__name">{{ menuName(m) }}</span>
                      <span class="menu__price" v-if="menuPrice(m)">{{ menuPrice(m) }}</span>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>

            <div v-if="detailLoading" class="state state--inline">⏳ 상세 불러오는 중…</div>
            <div v-else-if="detailMsg" class="state state--inline">{{ detailMsg }}</div>
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/api/axios'
import { useUser } from '@/store/User'

type Division = 'all' | 'cafe' | 'restaurant' | 'tour'
type MenuLike = string | { name?: string; price?: number | string }
type UIPlace = {
  place_name: string
  address?: string
  image_url?: string | string[] | null
  category?: string
  distance?: number
  rating?: number
}

const { user } = useUser()

/* 상태 */
const division = ref<Division>('all')
const keyword  = ref<string>('')
const results  = ref<UIPlace[]>([])
const loading  = ref<boolean>(false)
const msg      = ref<string>('')
const total    = ref<number>(0)

/* 상세 */
const detailOpen    = ref<boolean>(false)
const selected      = ref<any>(null)
const detailLoading = ref<boolean>(false)
const detailMsg     = ref<string>('')

/* 정렬 */
const sortKey = ref<'name' | 'distance' | 'rating'>('name')

/* 유틸 */
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaaaaa" font-family="Arial" font-size="16">no image</text></svg>`
  )

const rowKey = (p: UIPlace) =>
  `${(p.place_name || '').toLowerCase()}|${(p.address || '').toLowerCase()}`

const displayCategory = (raw?: string) => {
  const s = (raw || '').toLowerCase()
  if (s.includes('cafe') || s === 'cafe') return '카페'
  if (s.includes('restaurant') || s === 'restaurant') return '음식점'
  if (s.includes('tour') || s === 'tour') return '관광'
  return raw || ''
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el && el.src !== PLACEHOLDER) el.src = PLACEHOLDER
}

/** 이미지 문자열이 JSON이면 파싱해서 첫 장, 배열이면 첫 장, URL이면 그대로 */
function previewImage(img?: string | string[] | null): string {
  if (!img) return PLACEHOLDER
  if (Array.isArray(img)) return img[0] || PLACEHOLDER
  const s = String(img).trim()
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s)
      if (Array.isArray(arr) && typeof arr[0] === 'string') return arr[0]
    } catch { /* ignore */ }
  }
  return s || PLACEHOLDER
}

/* 메뉴 유틸 */
const menuKey   = (m: MenuLike) => (typeof m === 'string' ? m : (m.name ?? JSON.stringify(m)))
const menuName  = (m: MenuLike) => (typeof m === 'string' ? m : (m?.name ?? ''))
const menuPrice = (m: MenuLike) => {
  const v = typeof m === 'string' ? undefined : m?.price
  if (v === undefined || v === null || v === '') return ''
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n.toLocaleString('ko-KR') + '원' : String(v)
}

/* API: 검색 */
async function fetch() {
  loading.value = true
  msg.value = ''
  try {
    const body: any = { search: keyword.value || '' }
    if (division.value !== 'all') body.division = division.value
    const uid = Number((user as any)?.id)
    if (uid) body.user = { user_id: uid }

    const { data } = await api.post('/place/search_place', body)

    const raw: UIPlace[] = (data?.results ?? []).map((it: any) => ({
      place_name: it.place_name,
      address: it.address,
      image_url: it.image_url,
      category: it.category,
      distance: it.distance ?? undefined,
      rating: it.rating ?? undefined
    }))

    results.value = raw
    total.value = Number(data?.total ?? raw.length)
  } catch (e: any) {
    console.error('❌ 조회 실패:', e?.response?.data ?? e)
    results.value = []
    msg.value = e?.response?.data?.message ?? '조회에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

/* API: 상세 */
async function openPlaceDetail(name: string) {
  detailOpen.value = true
  detailLoading.value = true
  detailMsg.value = ''
  selected.value = null
  try {
    const { data } = await api.post('/place/select_place', { place: { place_name: name } })
    selected.value = data?.place ?? null
    if (!selected.value) detailMsg.value = '상세 정보를 불러오지 못했습니다.'
  } catch (e: any) {
    console.error('❌ 상세 실패:', e?.response?.data ?? e)
    detailMsg.value = e?.response?.data?.message ?? '상세 정보를 불러오지 못했습니다.'
  } finally {
    detailLoading.value = false
  }
}
function closeDetail() {
  detailOpen.value = false
  detailMsg.value = ''
}

/* 정렬 */
const sorted = computed<UIPlace[]>(() => {
  const arr = [...results.value]
  switch (sortKey.value) {
    case 'distance': return arr.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    case 'rating':   return arr.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    default:         return arr.sort((a, b) => a.place_name.localeCompare(b.place_name, 'ko'))
  }
})

/* 반응 */
watch(division, fetch)
onMounted(fetch)
</script>

<style scoped>
/* ===== 컨테이너 ===== */
.store-search{
  background:#fffbe6;
  border:1px solid #f2e7a1;
  border-radius:12px;
  padding:12px;
  box-sizing:border-box;

  /* ▶︎ 패널 자체의 너비를 기준으로 반응하도록 지정 */
  container-type: inline-size;
}

/* ===== 필터: 컨테이너 기반 반응형 그리드 =====
   [분류]는 작게, [검색]은 넓게(최소 200px 확보), [정렬]은 고정 작은 폭 */
.filters{
  display:grid;
  grid-template-columns: minmax(88px,110px) minmax(200px,1fr) minmax(116px,140px);
  gap:10px;
  align-items:center;
  margin-bottom:10px;
  overflow:hidden;                /* 가로 스크롤 방지 */
}
.filters > *{ min-width:0; }      /* 내부 요소가 폭을 밀어내지 않게 */

/* 패널이 좁아지면(<=520px) 정렬을 다음 줄로 내림 */
@container (max-width: 520px){
  .filters{
    grid-template-columns: minmax(88px,110px) minmax(200px,1fr);
  }
  .sort{ grid-column: 1 / -1; justify-self:end; }
}

/* 입력류 사이즈 통일 */
.select{
  width:100%;
  height:40px;
  padding:0 12px;
  border:1px solid #e5e5e5;
  border-radius:10px;
  background:#fff;
  box-sizing:border-box;
}
.searchbox{ position:relative; width:100%; }
.keyword{
  width:100%;
  height:40px;
  padding:0 44px 0 12px;          /* 돋보기 자리 */
  border:1px solid #e5e5e5;
  border-radius:10px;
  background:#fff;
  box-sizing:border-box;
}
.search-btn{
  position:absolute; right:6px; top:50%; transform:translateY(-50%);
  width:32px; height:32px; display:grid; place-items:center;
  border:1px solid #ebdfb0; border-radius:8px; background:#fff; color:#6b5a2a;
  cursor:pointer;
}
.search-btn:hover{ background:#fff6cf; }

/* 정렬 */
.sort{ display:inline-flex; align-items:center; gap:6px; justify-self:end; }
.sort__label{ font-size:12px; color:#7b6a40; white-space:nowrap; }
.sort__select{
  height:34px; min-width:72px;
  border-radius:10px; border:1px solid #f1cf8b; background:#fff;
  font-size:12px; padding:0 8px;
}

/* ===== 상태 ===== */
.state--box{ padding:10px 12px; background:#fff; border:1px dashed #e5e5e5; border-radius:8px; }
.state--inline{ margin-top:8px; color:#6b6b6b; }

/* ===== 결과/그리드 ===== */
.results-wrap{ display:flex; flex-direction:column; gap:10px; }
.grid{
  display:grid; gap:14px; list-style:none; padding:0; margin:0;
  grid-template-columns:1fr;                /* 모바일 1열 */
}
@container (min-width: 760px){ .grid{ grid-template-columns:1fr 1fr; } }     /* 태블릿 2열 */
@container (min-width: 1100px){ .grid{ grid-template-columns:1fr 1fr 1fr; } } /* 넓은 패널 3열 */
.grid__item{ min-width:0; }

/* ===== 카드 ===== */
.card{
  width:100%;
  display:flex; flex-direction:column; overflow:hidden;
  border:1px solid #eee2a8; border-radius:16px; background:#fff; text-align:left;
  transition:box-shadow .15s ease, transform .05s ease;
}
.card:hover{ box-shadow:0 8px 18px rgba(0,0,0,.08); transform: translateY(-1px); }

.card__img-wrap{ position:relative; }
.card__img{ width:100%; aspect-ratio:4/3; object-fit:cover; display:block; background:#f7f7f7; }

/* 태그 */
.card__tags{ position:absolute; left:10px; bottom:10px; }
.tag{ display:inline-block; padding:4px 8px; border-radius:100px; font-size:11px; font-weight:700; color:#fff; background:rgba(0,0,0,.58); }

/* 본문: 2줄 고정 → 카드 높이 균일 */
.card__body{ padding:12px; display:flex; flex-direction:column; gap:6px; }
.card__title{
  margin:0; font-size:16px; font-weight:800; color:#2b2110; line-height:1.35;
  min-height: calc(1.35em * 2);
}
.card__sub{
  margin:0; font-size:12px; color:#7a6440; line-height:1.4;
  min-height: calc(1.4em * 2);
}

/* 2줄 말줄임 */
.clamp-2{
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}

/* ===== 상세 패널 ===== */
.overlay{ position:fixed; inset:0; z-index:50; }
.overlay__backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.4); }
.panel{
  position:absolute; right:0; top:0; height:100%; width:100%; max-width:420px;
  background:#fff; border-top-left-radius:16px; border-bottom-left-radius:16px;
  box-shadow:-6px 0 20px rgba(0,0,0,.12); display:flex; flex-direction:column;
}
.panel__header{
  position:sticky; top:0; display:flex; align-items:center; justify-content:space-between; gap:8px;
  padding:12px; border-bottom:1px solid #eee; background:rgba(255,255,255,.95); backdrop-filter:saturate(110%) blur(6px);
}
.panel__title{ font-size:16px; font-weight:700; margin:0; color:#2b2110; }
.icon-btn{ height:36px; width:36px; display:grid; place-items:center; border-radius:10px; border:none; background:transparent; cursor:pointer; }
.icon-btn:hover{ background:#f8f5ef; }
.panel__content{ padding:12px; overflow-y:auto; }
.panel__img{ width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:12px; background:#f7f7f7; }
.panel__tags{ margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }

/* 상세 항목 */
.detail{ margin-top:8px; font-size:14px; color:#2b2110; }
.detail__row{ padding:8px 0; border-bottom:1px solid #f2efe9; }
.detail__dt{ color:#7a6440; font-size:13px; margin-bottom:4px; }
.detail__dd{ margin:0; }
.menu{ list-style:none; padding:0; margin:4px 0 0; }
.menu__row{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:4px 0; }
.menu__name{ font-size:15px; }
.menu__price{ font-variant-numeric: tabular-nums; color:#57462a; }

/* 패널 트랜지션 */
.slide-over-enter-active, .slide-over-leave-active{ transition: transform .25s ease, opacity .25s ease; }
.slide-over-enter-from, .slide-over-leave-to{ transform: translateX(100%); opacity:.6; }
</style>
