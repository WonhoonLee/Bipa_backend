<template>
  <div class="user-stats">
    <h2>👤 사용자 정보</h2>

    <p><strong>ID:</strong> {{ user.id || '-' }}</p>

    <!-- 닉네임 수정 -->
    <div class="nickname-section">
      <strong>닉네임:</strong>

      <template v-if="isEditing">
        <input v-model="tempNickname" type="text" />
        <button :disabled="saving" @click="saveNickname">✅</button>
        <button :disabled="saving" @click="cancelEdit">❌</button>
      </template>

      <template v-else>
        <span>{{ user.nickname || '(미설정)' }}</span>
        <button class="edit-btn" @click="editNickname">✏️</button>
      </template>
    </div>

    <p><strong>레벨:</strong> Lv.{{ user.level }}</p>
    <p><strong>배고픔:</strong> {{ user.hunger }} / 100</p>

    <button class="logout-btn" @click="handleLogout">🚪 로그아웃</button>

    <p v-if="msg" class="msg" :class="{ ok: msgType==='ok', err: msgType==='err' }">
      {{ msg }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/User'
import api from '@/api/axios' // baseURL: http://localhost:8080

const router = useRouter()
const { user, setNickname, logout } = useUser()

const isEditing = ref(false)
const tempNickname = ref(user.nickname)
const saving = ref(false)
const msg = ref('')
const msgType = ref<'ok' | 'err' | ''>('')

function flash(message: string, type: 'ok' | 'err' = 'ok') {
  msg.value = message
  msgType.value = type
  setTimeout(() => (msg.value = ''), 2000)
}

function editNickname() {
  tempNickname.value = user.nickname
  isEditing.value = true
}

async function saveNickname() {
  const name = (tempNickname.value || '').trim()
  if (!name) return

  if (!user.id) {
    flash('로그인 정보가 없어요. 다시 로그인해주세요.', 'err')
    return
  }

  saving.value = true
  try {
    // ✅ 백엔드 명세대로 전송 (루트 키: users)
    const { data } = await api.post('/user/change_nickname', {
      users: {
        id: user.id,
        nickname: name,
      },
    })
    console.log('[change_nickname resp.status]',status)
    console.log('[change_nickname resp.data]', JSON.stringify(data, null, 2))

    if (data?.status === 'success') {
    setNickname(name)
    localStorage.setItem('nickname', name)   // ✅ 로컬 저장
    isEditing.value = false
    flash('닉네임 변경 완료', 'ok')
    } else {
    flash('닉네임 변경 실패', 'err')
    }
  } catch (err) {
    console.error('닉네임 변경 API 실패', err)
    flash('서버 오류로 닉네임 변경 실패', 'err')
  } finally {
    saving.value = false
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

.msg {
  margin-top: 10px;
  font-size: 14px;
}
.msg.ok { color: #2f9e44; }
.msg.err { color: #d6336c; }
</style>
