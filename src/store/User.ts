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

// 로컬에서 불러오기 (임시용)
function loadNickname() {
  const saved = localStorage.getItem('nickname')
  if (saved) {
    user.nickname = saved
  }
}

function setNickname(name: string) {
  user.nickname = name
  localStorage.setItem('nickname', name)
}

export function useUser() {
  return {
    user,
    setNickname,
    loadNickname // ⬅ 이거 꼭 리턴해야 main.ts에서 쓸 수 있음!
  }
}
