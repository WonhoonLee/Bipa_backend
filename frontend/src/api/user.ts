import api from '@/api/axios'

export async function fetchCharacter(userId: number) {
  const { data } = await api.post('/user/characters', { user: { id: userId } })
  return data?.characters   // { id, user_id, level, exp, money, hungry_gauge, ... }
}


export async function changeNickname(userId: number, nickname: string) {
  const { data } = await api.post('/user/change_nickname', {
    users: { id: userId, nickname }
  })
  return data     // {status:'success', message:'name change complete'}
}
