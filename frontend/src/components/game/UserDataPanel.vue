<template>
  <aside class="panel-root" :class="{ minimized }">
    <!-- 헤더: 제목 없이 탭만 유지, 토글 버튼/아이콘 제거 -->
    <header class="panel-header">
      <nav class="tabs" role="tablist" aria-label="정보 탭">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-btn"
          :class="{ active: activeTab === index }"
          role="tab"
          :aria-selected="activeTab === index"
          @click="activeTab = index"
        >
          {{ tab }}
        </button>
      </nav>
    </header>

    <!-- 본문: minimized면 숨김 (부모에서 v-model:minimized로 제어 가능) -->
    <section v-show="!minimized" class="panel-body">
      <div class="tab-content" role="tabpanel">
        <Userinfo v-if="activeTab === 0" />
        <StoreSearch v-else-if="activeTab === 1" />
        <StoreCollection v-else-if="activeTab === 2" />
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Userinfo from '@/components/game/Userinfo.vue'
import StoreSearch from '@/components/store/StoreSearch.vue'
import StoreCollection from '@/components/store/StoreCollection.vue'

/**
 * 부모에서 <UserDataPanel v-model:minimized="..." /> 형태로
 * 최소화 상태를 제어할 수 있도록 호환 유지.
 * (이 컴포넌트 내부에는 더 이상 토글 버튼이 없음)
 */
const props = defineProps<{ minimized?: boolean }>()
const emit = defineEmits<{ (e: 'update:minimized', value: boolean): void }>()
const minimized = computed({
  get: () => props.minimized ?? false,
  set: (v: boolean) => emit('update:minimized', v),
})

const tabs = ['사용자 정보', '가게 검색', '도감']
const activeTab = ref(0)
</script>

<style scoped>
/* ===== 컨테이너 ===== */
.panel-root {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ===== 헤더(탭만) ===== */
.panel-header {
  position: relative;
  display: block;
  padding: 10px 12px;
  background: #fff2a8;
  border-bottom: 1px solid #f0e3a1;
}

.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 0 0 auto;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e9df9a;
  background: #f9f1bf;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1;
}
.tab-btn.active {
  background: #57c5b6;
  color: #fff;
  border-color: #3daaa0;
}

/* 토글/레일 UI 완전 제거(혹시 남아있는 클래스 대비) */
.toggle-btn,
.mini-rail {
  display: none !important;
}

/* ===== 본문 ===== */
.panel-body {
  display: flex;
  flex-direction: column;
  /* 헤더 높이에 맞춰 자동으로 꽉 차도록 */
  height: 100%;
  padding: 12px;
  min-height: 0;
}

.tab-content {
  flex: 1 1 auto;
  min-height: 0;
  background: #fff;
  border: 1px solid #eee2a1;
  border-radius: 10px;
  padding: 12px;
  overflow: auto;
}

/* minimized 클래스는 유지(부모 제어용), 내부 UI는 v-show로 숨김 */
.panel-root.minimized { /* 추가 동작 필요시 여기에 작성 */ }
</style>
