// src/store/User.ts
import { reactive } from 'vue'

const user = reactive({
  id: '',
  nickname: '',
  level: 1,
  hunger: 50,
  miniGames: {
    배달: 0,
    낚시: 0,
    뽑기: 0
  }
})

// ✅ 닉네임 로드
function loadNickname() {
  const saved = localStorage.getItem('nickname')
  if (saved) {
    user.nickname = saved
  }
}

// ✅ 닉네임 저장
function setNickname(name: string) {
  user.nickname = name
  localStorage.setItem('nickname', name)
}

// ✅ 로그아웃 → 모든 데이터 초기화
function logout() {
  user.id = ''
  user.nickname = ''
  user.level = 1
  user.hunger = 50
  user.miniGames = { 배달: 0, 낚시: 0, 뽑기: 0 }
  localStorage.clear()  // ✅ 저장된 닉네임/데이터 전부 초기화
}

export function useUser() {
  return {
    user,
    setNickname,
    loadNickname,
    logout   // ✅ 로그아웃 추가
  }
}
