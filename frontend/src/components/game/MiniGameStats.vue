<template>
  <div class="mini-game-stats">
    <h3>🎮 미니게임 기록</h3>
    <ul>
      <li v-for="(count, game) in records" :key="game">
        {{ game }}: {{ count }}회
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  records: Record<string, number>
}>()
</script>

<style scoped>
.mini-game-stats { margin-top: 1rem; background:#fff; border:1px solid #eee; border-radius:6px; padding:.75rem; }
ul { padding-left: 1rem; margin: .25rem 0 0; }
</style>
