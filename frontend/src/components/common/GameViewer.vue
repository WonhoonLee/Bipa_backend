<!-- src/components/common/GameViewer.vue  (수정본) -->
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
// public/unity/BipaGame/index.html
const unitySrc = '/unity/BipaGame/index.html'
</script>

<style scoped>
.frame-wrap{
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 80vh;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  border: 1px dashed #c7c7c7;
}
.unity-frame{
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  overflow: hidden;
}
</style>
