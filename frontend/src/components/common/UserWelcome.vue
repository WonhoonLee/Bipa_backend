<template>
  <div class="welcome-box">
    <h2>환영합니다, {{ nickname }}님!</h2>
  </div>
</template>

<script setup lang="ts">
// 임시로 하드코딩된 값 (나중에 백엔드 연동 시 교체 예정)
const nickname = '비파유저'
</script>

<style scoped>
.welcome-box {
  text-align: center;
  margin-top: 3rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
