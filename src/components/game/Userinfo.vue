<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
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

// ✅ 닉네임 저장 버튼 (DB 반영)
async function saveNickname() {
  if (tempNickname.value.trim() !== '') {
    setNickname(tempNickname.value)

    try {
      await axios.post('/user/first_login', {
        id: user.id,
        nickname: tempNickname.value,
        connected_at: new Date().toISOString() // 현재 시간
      })
      console.log('✅ 닉네임 변경 DB 반영 완료')
    } catch (error) {
      console.error('❌ 닉네임 변경 API 실패', error)
    }
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
