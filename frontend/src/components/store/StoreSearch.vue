<!-- src/components/store/StoreSearch.vue -->
<template>
  <div class="store-search">
    <h2>🏪 가게 검색</h2>

    <!-- 검색 조건 -->
    <div class="filters">
      <select v-model="mode">
        <option value="show">방문여부 보기(도감)</option>
        <option value="search">키워드 검색</option>
      </select>

      <select v-if="mode==='show'" v-model="division">
        <option value="cafe">☕ 카페</option>
        <option value="restaurant">🍽 음식점</option>
      </select>

      <input
        v-if="mode==='search'"
        v-model="keyword"
        type="text"
        placeholder="검색어를 입력하세요"
        @keyup.enter="fetch"
      />
      <button @click="fetch">🔍 조회</button>
    </div>

    <div v-if="loading" class="loading">⏳ 불러오는 중…</div>

    <div v-else-if="results.length" class="results">
      <div v-for="p in results" :key="p.place_name" class="place-card">
        <img
          v-if="p.image_url"
          :src="Array.isArray(p.image_url) ? p.image_url[0] : p.image_url"
          alt="가게 이미지"
        />
        <div class="info">
          <h3>
            {{ p.place_name }}
            <small v-if="mode==='show'">
              <span :class="p.visit ? 'tag-yes' : 'tag-no'">
                {{ p.visit ? '방문함' : '미방문' }}
              </span>
            </small>
          </h3>
          <p v-if="p.address">{{ p.address }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-results">검색 결과가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import { useUser } from '@/store/User'

/** UI에서 공통으로 사용할 타입(모든 필드 선택) */
type UIPlace = {
  place_name: string
  address?: string
  image_url?: string | string[]
  visit?: boolean
}

type Division = 'cafe' | 'restaurant'

const { user } = useUser()

const mode = ref<'show' | 'search'>('show')     // 도감/검색 탭
const division = ref<Division>('cafe')          // 도감용 분류
const keyword = ref('')                         // 검색어
const results = ref<UIPlace[]>([])
const loading = ref(false)

/** 도감: 방문여부 조회 (POST /place/show_place) */
async function loadShowPlace() {
  const { data } = await api.post('/place/show_place', {
    user: { user_id: user.id },
    place: { division: division.value }
  })
  // data.place: { place_name, visit }[]
  results.value = (data?.place ?? []).map((it: any) => ({
    place_name: it.place_name,
    visit: !!it.visit
  })) as UIPlace[]
}

/** 검색: 키워드 검색 (POST /place/search_place) */
async function loadSearchPlace() {
  const { data } = await api.post('/place/search_place', {
    search: keyword.value ?? ''
  })
  // data.results: { place_name, address?, image_url? }[]
  results.value = (data?.results ?? []).map((it: any) => ({
    place_name: it.place_name,
    address: it.address,
    image_url: it.image_url
  })) as UIPlace[]
}

async function fetch() {
  loading.value = true
  try {
    if (mode.value === 'show') await loadShowPlace()
    else await loadSearchPlace()
  } catch (e) {
    console.error('❌ 조회 실패:', e)
    results.value = []
  } finally {
    loading.value = false
  }
}

// 초기 1회 로드
fetch()
</script>

<style scoped>
.store-search {
  padding: 1rem;
  background: #fffbe6;
  border-radius: 8px;
}
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  align-items: center;
}
.filters select,
.filters input {
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.filters button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.filters button:hover { background: #45a049; }
.loading { font-style: italic; color: #888; }
.results { display: flex; flex-direction: column; gap: 10px; }
.place-card {
  display: flex; gap: 10px; align-items: center;
  background: white; border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 10px;
}
.place-card img {
  width: 80px; height: 80px; object-fit: cover; border-radius: 4px;
}
.info h3 { margin: 0; display: flex; gap: 8px; align-items: center; }
.tag-yes, .tag-no {
  font-size: 12px; padding: 2px 6px; border-radius: 10px;
}
.tag-yes { background:#e6ffed; color:#2e7d32; }
.tag-no  { background:#ffecec; color:#c62828; }
.no-results { text-align: center; color: #999; }
</style>
