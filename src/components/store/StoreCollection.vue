<template>
  <div class="store-collection">
    <h2>📖 음식점/카페 도감</h2>

    <!-- ✅ 필터 버튼 -->
  <div class="filters">
    <button 
      :class="{ active: selectedFilter === 'all' }" 
      @click="selectedFilter = 'all'">
      전체
    </button>

    <button 
      :class="{ active: selectedFilter === 'cafe' }" 
      @click="selectedFilter = 'cafe'">
      카페
    </button>

    <button 
      :class="{ active: selectedFilter === 'restaurant' }" 
      @click="selectedFilter = 'restaurant'">
      음식점
    </button>
  </div>


    <!-- ✅ 가게 리스트 -->
    <div class="card-list">
      <StoreCard
        v-for="store in filteredStores"
        :key="store.id"
        :store="store"
        @click="selectStore(store)"
      />
    </div>

    <!-- ✅ 상세정보 -->
    <div v-if="selectedStore" class="detail">
      <h3>{{ selectedStore.name }}</h3>
      <p><strong>카테고리:</strong> {{ selectedStore.category }}</p>
      <p><strong>설명:</strong> {{ selectedStore.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoreCard from './StoreCard.vue'   // ✅ StoreCard 재사용

const stores = ref([
  { id: 1, name: '별다방 카페', category: 'cafe', description: '달달한 디저트와 커피가 맛있는 카페' },
  { id: 2, name: '김밥천국', category: 'restaurant', description: '저렴하고 다양한 한식 메뉴' },
  { id: 3, name: '카페 모카', category: 'cafe', description: '분위기 좋은 스페셜티 카페' },
  { id: 4, name: '왕돈까스', category: 'restaurant', description: '수제 돈까스 전문점' }
])

const selectedFilter = ref<'all' | 'cafe' | 'restaurant'>('all')
const selectedStore = ref<any>(null)

// ✅ 필터링된 리스트
const filteredStores = computed(() => {
  if (selectedFilter.value === 'all') return stores.value
  return stores.value.filter(store => store.category === selectedFilter.value)
})

// ✅ 카드 클릭 시 상세보기
function selectStore(store: any) {
  selectedStore.value = store
}
</script>

<style scoped>
.store-collection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ✅ 필터 버튼 스타일 */
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.filters button {
  padding: 6px 12px;
  border: none;
  background: #eee;
  border-radius: 6px;
  cursor: pointer;
}

.filters button.active {
  background: #fee500;
}

/* ✅ 리스트 레이아웃 */
.card-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* ✅ 상세보기 박스 */
.detail {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
