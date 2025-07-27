<template>
  <div class="home">
    <GameViewer class="left-panel" />
    <UserDataPanel class="right-panel" />
  </div>
</template>

<script setup lang="ts">
import UserDataPanel from '../components/game/UserDataPanel.vue'
import GameViewer from "../components/game/GameViewer.vue"

</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
}
.left-panel {
  flex: 2;
  border-right: 1px solid #ddd;
}
.right-panel {
  flex: 1;
  padding: 1rem;
  background: #f9f9f9;
}
</style>
