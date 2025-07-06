<template>
  <div class="collection">
    <h2>📖 음식점/카페 도감</h2>

    <!-- 필터 -->
    <div class="filters">
      <select v-model="selectedType">
        <option value="all">전체</option>
        <option value="cafe">카페</option>
        <option value="restaurant">음식점</option>
      </select>
    </div>

    <!-- 리스트 -->
    <div class="card-list">
      <StoreListItem
        v-for="item in filteredStores"
        :key="item.id"
        :store="item"
        @click="selectStore(item)"
      />
    </div>

    <!-- 상세정보 (간단히 아래 출력) -->
    <div v-if="selected" class="detail">
      <h3>선택된 가게 정보</h3>
      <p><strong>이름:</strong> {{ selected.name }}</p>
      <p><strong>카테고리:</strong> {{ selected.category }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoreListItem from './StoreListItem.vue'

interface StoreItem {
  id: string
  name: string
  category: string // 'cafe' | 'restaurant'
}

const selectedType = ref<'all' | 'cafe' | 'restaurant'>('all')

const stores = ref<StoreItem[]>([
  { id: '1', name: '스타카페', category: 'cafe' },
  { id: '2', name: '김밥천국', category: 'restaurant' },
  { id: '3', name: '카페베네', category: 'cafe' },
])

const selected = ref<StoreItem | null>(null)

const filteredStores = computed(() => {
  if (selectedType.value === 'all') return stores.value
  return stores.value.filter(s => s.category === selectedType.value)
})

function selectStore(store: StoreItem) {
  selected.value = store
}
</script>

<style scoped>
.collection {
  padding: 1rem;
}
.filters {
  margin-bottom: 1rem;
}
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.detail {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
