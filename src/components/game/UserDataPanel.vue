<template>
  <div class="panel">
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="{ active: activeTab === index }"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">
      <UserInfo v-if="activeTab === 0" />
      <StoreSearch v-else-if="activeTab === 1" />
      <StoreCollection v-else-if="activeTab === 2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Userinfo from '@/components/game/Userinfo.vue'
import StoreSearch from '@/components/store/StoreSearch.vue'
import StoreCollection from '@/components/store/StoreCollection.vue'

const tabs = ['사용자 정보', '가게 검색', '도감']
const activeTab = ref(0)
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
}
.tabs {
  display: flex;
  margin-bottom: 1rem;
}
.tabs button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: #ddd;
  cursor: pointer;
}
.tabs button.active {
  background: #57c5b6;
  color: white;
}
.tab-content {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
}
</style>
