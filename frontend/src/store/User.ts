import { reactive } from 'vue'

const user = reactive({
  id: '' as number | string | '',
  nickname: '',
  level: 1,
  hunger: 50,
  miniGames: {
    배달: 0,
    낚시: 0,
    뽑기: 0,
  },
})

function loadNickname() {
  const saved = localStorage.getItem('nickname')
  if (saved) user.nickname = saved
}

function setNickname(name: string) {
  user.nickname = name
  localStorage.setItem('nickname', name)
}

function clearAll() {
  user.id = ''
  user.nickname = ''
  user.level = 1
  user.hunger = 50
  user.miniGames = { 배달: 0, 낚시: 0, 뽑기: 0 }
  localStorage.removeItem('nickname')
}

function logout() {
  try {
    // 카카오 세션도 가능하면 종료
    // @ts-ignore
    const Kakao = window.Kakao
    if (Kakao?.Auth?.logout) {
      Kakao.Auth.logout()
    }
  } catch {}
  clearAll()
}

export function useUser() {
  return { user, setNickname, loadNickname, logout, clearAll }
}
