// 왼쪽 게임 실행 화면 (WebGL 자리 등)
<template>
  <div class="game-viewer">
    <!-- 여기에 Unity WebGL / iframe 자리 -->
    <h2>🕹 게임 화면 (GameViewer)</h2>
    <div class="mock-frame">게임 콘텐츠 영역입니다</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.game-viewer {
  padding: 1rem;
  background-color: #f0f0f0;
  height: 100%;
}
.mock-frame {
  height: 300px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  background: white;
}
</style>
