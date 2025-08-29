<template>
  <div class="store-search d-flex flex-column h-100">
    <!-- ===== 필터: 상단 고정(sticky) ===== -->
    <div class="filters">
      <v-row class="g-2" align="center" no-gutters>
        <!-- 분류 -->
        <v-col cols="12" sm="4">
          <v-select
            v-model="division"
            :items="divisionItems"
            item-title="label"
            item-value="value"
            label="분류"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
          />
        </v-col>

        <!-- 검색 -->
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="keyword"
            label="검색어를 입력하세요"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            @keyup.enter="fetch"
            :append-inner-icon="loading ? 'mdi-loading' : 'mdi-magnify'"
            :loading="loading"
            @click:append-inner="!loading && fetch()"
          />
        </v-col>

        <!-- 정렬 -->
        <v-col cols="12" sm="3">
          <v-select
            v-model="sortKey"
            :items="sortItems"
            item-title="label"
            item-value="value"
            label="정렬"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
          />
        </v-col>
      </v-row>
    </div>

    <!-- ===== 상태 ===== -->
    <div v-if="loading || msg" class="px-3">
      <v-alert
        v-if="loading"
        type="info"
        variant="tonal"
        class="mb-2"
        border="start"
      >
        불러오는 중…
      </v-alert>
      <v-alert
        v-else
        type="warning"
        variant="tonal"
        class="mb-2"
        border="start"
      >
        {{ msg }}
      </v-alert>
    </div>

    <!-- ===== 결과 ===== -->
    <div class="results flex-1-1 overflow-auto px-3 pb-3">
      <div class="text-subtitle-2 text-grey-darken-1 mb-2">
        총 {{ total || results.length }}곳
      </div>

      <v-row dense>
        <v-col
          v-for="p in sorted"
          :key="rowKey(p)"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="rounded-xl" elevation="1" @click="openPlaceDetail(p.place_name)">
            <!-- 이미지 -->
            <div class="img-wrap">
              <v-img
                :src="previewImage(p.image_url)"
                height="140"
                cover
                class="rounded-t-xl"
                :gradient="'to bottom, rgba(0,0,0,0), rgba(0,0,0,.25)'"
              >
                <!-- 로딩/에러 슬롯로 대체 화면 -->
                <template #placeholder>
                  <div class="d-flex align-center justify-center h-100 bg-grey-lighten-3">
                    <v-progress-circular indeterminate size="20" />
                  </div>
                </template>
                <template #error>
                  <div class="d-flex align-center justify-center h-100 bg-grey-lighten-3">
                    <v-icon icon="mdi-image-broken-variant" />
                  </div>
                </template>
              </v-img>

              <!-- 태그 오버레이 -->
              <div v-if="p.category" class="card-tag">
                <v-chip size="x-small" color="grey-darken-1" variant="flat">
                  #{{ displayCategory(p.category) }}
                </v-chip>
              </div>
            </div>

            <!-- 본문 -->
            <v-card-text>
              <div class="card-title clamp-2">{{ p.place_name }}</div>
              <div v-if="p.address" class="card-sub clamp-2">{{ p.address }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- ===== 상세: 오른쪽 슬라이드 다이얼로그 ===== -->
    <v-dialog
      v-model="detailOpen"
      :scrim="true"
      transition="dialog-right-transition"
      width="420"
    >
      <v-card class="rounded-lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-subtitle-1 font-weight-bold">
            {{ selected?.place_name || '상세' }}
          </div>
          <v-btn icon variant="text" @click="closeDetail" aria-label="닫기">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-img
            :src="previewImage(selected?.image_url)"
            height="200"
            cover
            class="rounded-lg mb-3"
          >
            <template #error>
              <div class="d-flex align-center justify-center h-100 bg-grey-lighten-3">
                <v-icon icon="mdi-image-broken-variant" />
              </div>
            </template>
          </v-img>

          <div v-if="selected?.category" class="mb-3">
            <v-chip size="small" color="grey-darken-1" variant="flat">
              #{{ displayCategory(selected!.category) }}
            </v-chip>
          </div>

          <div class="detail">
            <div class="detail-row" v-if="selected?.address">
              <div class="detail-dt">주소</div>
              <div class="detail-dd">{{ selected.address }}</div>
            </div>

            <div class="detail-row" v-if="selected?.business_hours">
              <div class="detail-dt">영업시간</div>
              <div class="detail-dd">{{ selected.business_hours }}</div>
            </div>

            <div
              class="detail-row"
              v-if="Array.isArray(selected?.menu) && selected!.menu.length"
            >
              <div class="detail-dt">메뉴</div>
              <div class="detail-dd">
                <v-list density="compact">
                  <v-list-item
                    v-for="m in selected!.menu"
                    :key="menuKey(m)"
                  >
                    <template #title>
                      <span class="menu-name">{{ menuName(m) }}</span>
                    </template>
                    <template #append>
                      <span class="menu-price" v-if="menuPrice(m)">{{ menuPrice(m) }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </div>

          <v-alert
            v-if="detailLoading"
            type="info"
            variant="tonal"
            class="mt-2"
            border="start"
          >
            상세 불러오는 중…
          </v-alert>
          <v-alert
            v-else-if="detailMsg"
            type="warning"
            variant="tonal"
            class="mt-2"
            border="start"
          >
            {{ detailMsg }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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

/* ===== 상태 ===== */
const division = ref<Division>('all')
const keyword  = ref('')
const results  = ref<UIPlace[]>([])
const loading  = ref(false)
const msg      = ref('')
const total    = ref(0)

/* 상세 */
const detailOpen    = ref(false)
const selected      = ref<any>(null)
const detailLoading = ref(false)
const detailMsg     = ref('')

/* 정렬 */
const sortKey = ref<'name' | 'distance' | 'rating'>('name')

/* 드롭다운 아이템 */
const divisionItems = [
  { label: '전체', value: 'all' },
  { label: '카페', value: 'cafe' },
  { label: '음식점', value: 'restaurant' },
  { label: '관광', value: 'tour' },
]
const sortItems = [
  { label: '이름', value: 'name' },
  { label: '거리', value: 'distance' },
  { label: '평점', value: 'rating' },
]

/* 키/표시 유틸 */
const rowKey = (p: UIPlace) =>
  `${(p.place_name || '').toLowerCase()}|${(p.address || '').toLowerCase()}`

const displayCategory = (raw?: string) => {
  const s = (raw || '').toLowerCase()
  if (s.includes('cafe') || s === 'cafe') return '카페'
  if (s.includes('restaurant') || s === 'restaurant') return '음식점'
  if (s.includes('tour') || s === 'tour') return '관광'
  return raw || ''
}

/** 이미지 문자열이 JSON이면 파싱해서 첫 장, 배열이면 첫 장, URL이면 그대로 */
function previewImage(img?: string | string[] | null): string {
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaaaaa" font-family="Arial" font-size="16">no image</text></svg>`
    )
  if (!img) return PLACEHOLDER
  if (Array.isArray(img)) return img[0] || PLACEHOLDER
  const s = String(img).trim()
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s)
      if (Array.isArray(arr) && typeof arr[0] === 'string') return arr[0]
    } catch {}
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

/* ===== API: 검색 ===== */
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
      rating: it.rating ?? undefined,
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

/* ===== API: 상세 ===== */
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

/* ===== 정렬 ===== */
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
/* 패널 전체 배경/테두리 유지 */
.store-search{
  background:#fffbe6;
  border:1px solid #f2e7a1;
  border-radius:12px;
}

/* 상단 필터를 패널 안쪽에서 고정 */
.filters{
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fffbe6; /* 패널 배경과 동일 */
  padding: 12px 12px 8px;
  border-bottom: 1px solid #f6edc4;
}

/* 리스트 영역(스크롤) */
.results{}

/* 카드 내부 타이틀/서브(2줄 고정) */
.card-title{
  font-weight: 800; font-size: 16px; line-height: 1.35;
  margin-bottom: 4px;
  min-height: calc(1.35em * 2);
}
.card-sub{
  color: #7a6440; font-size: 12px; line-height: 1.4;
  min-height: calc(1.4em * 2);
}

/* 2줄 말줄임 */
.clamp-2{
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}

/* 이미지 + 태그 오버레이 */
.img-wrap{ position: relative; }
.card-tag{ position: absolute; left: 8px; bottom: 8px; }

/* 상세 레이아웃 */
.detail { font-size: 14px; color:#2b2110; }
.detail-row { padding: 8px 0; border-bottom: 1px solid #f2efe9; }
.detail-dt { color:#7a6440; font-size:13px; margin-bottom: 4px; }
.detail-dd { margin: 0; }
.menu-name { font-size: 15px; }
.menu-price { font-variant-numeric: tabular-nums; color:#57462a; }
</style>
