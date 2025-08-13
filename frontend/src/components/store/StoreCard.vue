<template>
  <div class="store-card">
    <img
      class="thumbnail"
      :src="store.visited ? store.visitedImage : store.image"
      alt="store image"
    />
    <p class="name">{{ store.name }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  store: {
    id: string | number
    name: string
    category?: string
    description?: string
    image?: string
    visitedImage?: string
    visited?: boolean
  }
}>()

const fallback = '/default-store.png' 
</script>

<style scoped>
.store-card {
  display: flex;
  flex-direction: column;   /* ✅ 세로 배치 */
  align-items: center;      /* ✅ 이미지/텍스트 가운데 정렬 */
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.store-card:hover {
  transform: scale(1.03);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  width: 100px;        /* ✅ 이미지 크게 */
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;  /* ✅ 이미지와 이름 사이 여백 */
}

.name {
  font-weight: bold;
  font-size: 16px;
  margin: 0;
  text-align: center;  /* ✅ 텍스트 중앙 정렬 */
}
</style>