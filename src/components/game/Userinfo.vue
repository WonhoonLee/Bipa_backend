<template>
  <div class="user-stats">
    <h2>👤 사용자 정보</h2>

    <p><strong>ID:</strong> {{ user.id }}</p>

    <!-- 닉네임 수정 블록 -->
    <div class="nickname-section">
      <strong>닉네임:</strong>
      <template v-if="isEditing">
        <input v-model="tempNickname" type="text" />
        <button @click="saveNickname">✅</button>
        <button @click="cancelEdit">❌</button>
      </template>
      <template v-else>
        <span>{{ user.nickname }}</span>
        <button class="edit-btn" @click="editNickname">✏️</button>
      </template>
    </div>

    <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
    <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>

    <!-- 나중에 다시 연결 -->
    <!-- <MiniGameStats :records="user.miniGames" /> -->

    <button class="logout-btn" @click="handleLogout">🚪 로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/User'

const router = useRouter()
const { user, setNickname, logout } = useUser()

const isEditing = ref(false)
const tempNickname = ref(user.nickname)

function editNickname() {
  tempNickname.value = user.nickname
  isEditing.value = true
}

async function saveNickname() {
  if (!tempNickname.value.trim()) return
  setNickname(tempNickname.value) // 로컬/스토어 즉시 반영

  try {
    await axios.post('/user/first_login', {
      user: {
        id: user.id,
        nickname: tempNickname.value,
        connected_at: new Date().toISOString(),
      },
    })
    console.log('✅ 닉네임 변경 DB 반영 완료')
  } catch (err) {
    console.error('❌ 닉네임 변경 API 실패', err)
  } finally {
    isEditing.value = false
  }
}

function cancelEdit() {
  isEditing.value = false
}

function handleLogout() {
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    logout()
    router.push('/')
  }
}
</script>

<style scoped>
.user-stats {
  padding: 1rem;
  background: #fff8dc;
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
.edit-btn {
  padding: 4px 6px;
  background: #ddd;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn:hover { background: #bbb; }
.logout-btn {
  margin-top: 20px;
  padding: 8px 12px;
  background: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}
.logout-btn:hover { background: #e60000; }
</style>
