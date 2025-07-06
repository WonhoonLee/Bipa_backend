<template>
  <div class="store-card">
    <img
      class="thumbnail"
      :src="store.image || fallback"
      alt="store image"
    />
    <p class="name">{{ store.name }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  store: {
    id: string
    name: string
    image?: string
  }
}>()

const fallback = '/default-store.png' // 👉 public 폴더에 기본 이미지 넣어도 좋아
</script>

<style scoped>
.store-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.store-card:hover {
  transform: scale(1.03);
}
.thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.name {
  margin-top: 0.5rem;
  font-weight: bold;
}
</style>
