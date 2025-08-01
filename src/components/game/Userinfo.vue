<template>
  <div class="user-stats">
    <h2>👤 사용자 정보</h2>
    <p><strong>ID:</strong> {{ user.id }}</p>

    <!-- ✅ 닉네임 수정 모드 -->
    <div class="nickname-section">
      <strong>닉네임:</strong>
      <template v-if="isEditing">
        <input type="text" v-model="tempNickname" />
        <button @click="saveNickname">✅</button>
        <button @click="cancelEdit">❌</button>
      </template>
      <template v-else>
        <span>{{ user.nickname }}</span>
        <button @click="editNickname">✏️</button>
      </template>
    </div>

    <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
    <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>

    <MiniGameStats :records="user.miniGames" />

    <!-- ✅ 로그아웃 버튼 추가 -->
    <button class="logout-btn" @click="handleLogout">🚪 로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/User'
import MiniGameStats from './MiniGameStats.vue'

const { user, setNickname, logout } = useUser()
const router = useRouter()

const isEditing = ref(false)
const tempNickname = ref(user.nickname)

function editNickname() {
  tempNickname.value = user.nickname
  isEditing.value = true
}

function saveNickname() {
  if (tempNickname.value.trim() !== '') {
    setNickname(tempNickname.value) // ✅ localStorage도 반영됨
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

// 🚪 로그아웃 처리
function handleLogout() {
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    logout()            // ✅ user 데이터 초기화 + localStorage 초기화
    router.push('/')    // ✅ 로그인 화면으로 이동
  }
}
</script>

<style scoped>
.user-stats {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  font-size: 16px;
}

.nickname-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.nickname-section input {
  padding: 4px 6px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.nickname-section button {
  padding: 4px 6px;
  border: none;
  cursor: pointer;
  background: #eee;
  border-radius: 4px;
}

.nickname-section button:hover {
  background: #ddd;
}

/* 🚪 로그아웃 버튼 스타일 */
.logout-btn {
  margin-top: 16px;
  padding: 8px 12px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.logout-btn:hover {
  background: #e60000;
}
</style>
