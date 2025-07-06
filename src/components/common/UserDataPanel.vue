// 오른쪽 사용자 정보/검색/도감 탭 구조
<template>
  <div class="user-data-panel">
    <!-- 탭 버튼 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        :class="{ active: currentTab === tab }"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 탭 내용 -->
    <div class="tab-content">
      <div v-if="currentTab === '사용자 정보'">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>닉네임:</strong> {{ user.nickname }}</p>
        <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
        <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>
      </div>

      <StoreSearch v-if="currentTab === '가게 검색'" />
      <StoreCollection v-if="currentTab === '도감'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/store/User'
import StoreSearch from '@/components/store/StoreSearch.vue'
import StoreCollection from '@/components/store/StoreCollection.vue'

const { user } = useUser()

const tabs = ['사용자 정보', '가게 검색', '도감']
const currentTab = ref(tabs[0])
</script>

<style scoped>
.user-data-panel {
  padding: 1rem;
  background-color: #fff;
  height: 100%;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tabs button {
  padding: 0.5rem 1rem;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.tabs button.active {
  background-color: #007bff;
  color: white;
}
.tab-content {
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}
</style>
