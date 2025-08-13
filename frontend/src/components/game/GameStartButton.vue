<template>
  <button class="start-btn" @click="goToGame">
    게임 시작
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToGame() {
  alert('게임 화면으로 이동합니다! (유니티 연동 예정)')
  // router.push('/game/start') // 나중에 실제 게임 화면 생기면 이동
}
</script>

<style scoped>
.start-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #57c5b6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
