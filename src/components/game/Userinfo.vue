<template>
  <div class="user-stats">
    <h2>👤 사용자 정보</h2>
    <p><strong>ID:</strong> {{ user.id }}</p>

    <!-- ✅ 닉네임: 수정 모드 -->
    <div class="nickname-section">
      <strong>닉네임:</strong>
      <template v-if="isEditing">
        <input type="text" v-model="tempNickname" class="nickname-input" />
        <button class="confirm-btn" @click="saveNickname">✅</button>
        <button class="cancel-btn" @click="cancelEdit">❌</button>
      </template>
      <template v-else>
        <span class="nickname-text">{{ user.nickname }}</span>
        <button class="edit-btn" @click="editNickname">✏️</button>
      </template>
    </div>

    <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
    <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>

    <!-- 🚪 로그아웃 버튼 -->
    <button class="logout-btn" @click="handleLogout">🚪 로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/User'

const { user, setNickname, logout } = useUser()
const router = useRouter()

const isEditing = ref(false)
const tempNickname = ref(user.nickname)

// ✏️ 수정 버튼
function editNickname() {
  tempNickname.value = user.nickname
  isEditing.value = true
}

// ✅ 닉네임 저장 버튼
async function saveNickname() {
  if (tempNickname.value.trim() !== '') {
    setNickname(tempNickname.value)

    // 🔥 📌 👉 **여기서 DB API 호출하면 됨!**
    // await axios.post('/api/update-nickname', {
    //   id: user.id,
    //   nickname: tempNickname.value
    // })

  }
  isEditing.value = false
}

// ❌ 취소 버튼
function cancelEdit() {
  isEditing.value = false
}

// 🚪 로그아웃 버튼
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

/* ✅ 닉네임 수정 영역 */
.nickname-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

/* ✅ 닉네임 텍스트 */
.nickname-text {
  font-size: 18px;
  font-weight: bold;
}

/* ✅ 입력창 */
.nickname-input {
  padding: 6px 8px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* ✏️ 수정 버튼 (확실히 보이게 변경) */
.edit-btn {
  font-size: 20px;            /* ✅ 아이콘 크기 키움 */
  padding: 6px 10px;
  background: #ffe066;        /* ✅ 노란색 배경 */
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.edit-btn:hover {
  background: #ffcc00;
}

/* ✅, ❌ 버튼 */
.confirm-btn,
.cancel-btn {
  font-size: 18px;
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  background: #ddd;
  border-radius: 6px;
}
.confirm-btn:hover {
  background: #a3e635; /* 연두색 */
}
.cancel-btn:hover {
  background: #ff6b6b; /* 빨간색 */
}

/* 🚪 로그아웃 버튼 */
.logout-btn {
  margin-top: 20px;
  padding: 10px 14px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  font-size: 18px;
}
.logout-btn:hover {
  background: #e60000;
}
</style>
