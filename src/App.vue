<template>
  <router-view />
</template>

<script setup lang="ts">
// App.vue는 그냥 라우터 뷰만 유지
</script>

<style>
/* ✅ ✅ 전역 스타일 추가 ✅ ✅ */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;   /* 🔥 전체 스크롤 완전 차단 */
}

#app {
  height: 100%;
}
</style>
