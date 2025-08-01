<!-- src/components/store/StoreSearch.vue -->
<template>
  <div class="store-search">
    <input v-model="keyword" placeholder="가게 이름을 검색하세요" />

    <div class="store-list">
      <StoreCard
        v-for="store in filteredStores"
        :key="store.id"
        :store="store"
        @click="selectStore(store)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoreCard from './StoreCard.vue'
import coffeeGray from '@/assets/images/gray_coffee.png'
import coffeeColor from '@/assets/images/color_coffee.png'
import gray_food from '@/assets/images/gray_food.png'
import color_food from '@/assets/images/color_food.png'
const keyword = ref('')

// 🔁 임시 mock 데이터 (나중에 API 대체 예정)
const storeList = ref([
  { id: '1', name: '카페 비파', image: coffeeGray, visitedImage: coffeeColor, category: '카페', visited: true },
  { id: '2', name: '삼겹살집', image: gray_food, visitedImage: color_food, category: '음식점', visited: true },
  { id: '3', name: '김밥천국', image: gray_food, visitedImage: color_food, category: '음식점', visited: false },
])

const filteredStores = computed(() =>
  storeList.value.filter(store =>
    store.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

function selectStore(store: { id: string; name: string }) {
  alert(`선택한 가게: ${store.name}`)
}
</script>

<style scoped>
.store-search {
  padding: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.store-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
</style>
