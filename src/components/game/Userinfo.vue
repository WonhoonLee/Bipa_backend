<template>
  <div class="user-stats">
    <h2>👤 사용자 정보</h2>
    <p><strong>ID:</strong> {{ user.id }}</p>
    <p><strong>닉네임:</strong> {{ user.nickname }}</p>
    <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
    <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>

    <MiniGameStats :records="user.miniGames" />
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/store/User'
import MiniGameStats from './MiniGameStats.vue'

const { user } = useUser()
</script>

<style scoped>
.user-stats {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  font-size: 16px;
}
</style>
