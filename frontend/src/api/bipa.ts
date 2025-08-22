// src/api/bipa.ts
import api from '@/api/axios'

/** 공통 에러 형태 */
export interface ApiError {
  status: 'error'
  error_code: 'USER_NOT_FOUND' | 'PLACE_NOT_FOUND' | 'INVALID_INPUT' | 'INTERNAT_ERROR' | string
  message: string
}

/** 1) 캐릭터 기본 정보 */
export async function fetchCharacters(userId: number) {
  const { data } = await api.post('/user/characters', { user: { id: userId } })
  // 기대응답: { characters: { id, user_id, level, ... } }
  return data
}

/** 2) 미니게임 결과 저장 */
export type CharacterPatch = {
  id: number
  level: number
  exp: number
  money: number
  hungry_gauge: number
  max_actopus: number
  max_fig: number
  max_yudal: number
  max_fish: number
}
export async function postPlayGame(payload: CharacterPatch) {
  const { data } = await api.post('/play_game', { characters: payload })
  // 기대응답: { status: 'success' }
  return data
}

/** 3) 카페/음식점/관광 아이콘 클릭 -> 목록 */
export async function showPlace(userId: number, division: 'cafe' | 'restaurant' | 'tour') {
  const { data } = await api.post('/place/show_place', {
    user: { user_id: userId },
    place: { division },
  })
  // 기대응답: { place: [ { place_name: string, visit: boolean }, ... ] }
  return data
}

/** 4) 아이템 하나 선택 -> 상세 */
export async function selectPlace(placeName: string) {
  const { data } = await api.post('/place/select_place', {
    place: { place_name: placeName },
  })
  // 기대응답: { place: { place_name, category, address, business_hours, menu: string[] } }
  return data
}

/** 5) 검색 */
export async function searchPlace(userId: number, name: string, division: 'cafe' | 'restaurant' | 'tour') {
  const { data } = await api.post('/search_place', {
    user: { user_id: userId },
    place: { name, division },
  })
  // 기대응답: { results: [ { place_name: string }, ... ] }
  return data
}

/** 6) 사용자 도감에 장소 추가 */
export async function addToUserBook(search: string) {
  const { data } = await api.post('/inuserbook', { search })
  // 기대응답: { message, division, place_name, status: 'success' }
  return data
}
