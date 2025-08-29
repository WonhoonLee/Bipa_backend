<!-- src/components/common/GameViewer.vue -->
<template>
  <div class="frame-wrap">
    <iframe
      class="unity-frame"
      :src="unitySrc"
      title="BipaGame"
      allow="autoplay; fullscreen; clipboard-read; clipboard-write"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// Unity WebGL 빌드 경로
const unitySrc = '/unity/BipaGame/index.html'
</script>

<style scoped>
/* 부모를 꽉 채움 */
.frame-wrap {
  position: relative;
  width: 100%;
  height: 100%;       /* ✅ 남는 여백 없이 전체 채우기 */
  background: #000;   /* 로딩 시 배경 */
  border-radius: 0;   /* 여백 없애려면 둥근 모서리도 제거 가능 */
  overflow: hidden;
}

/* iFrame을 부모에 완전히 맞춤 */
.unity-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
