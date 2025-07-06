<template>
  <div class="game-main">
    <GameViewer class="left" />
    <UserDataPanel class="right" />
  </div>
</template>

<script setup lang="ts">
import GameViewer from '@/components/common/GameViewer.vue'
import UserDataPanel from '@/components/common/UserDataPanel.vue'
</script>

<style scoped>
.game-main {
  display: flex;
  height: 100vh;
}
.left {
  flex: 2;
  background-color: #111; /* 미니게임 자리 */
}
.right {
  flex: 1;
  background-color: #f5f5f5;
  padding: 1rem;
  overflow-y: auto;
}
</style>
