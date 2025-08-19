import api from '@/api/axios'

export type Division = 'cafe' | 'restaurant'

export interface ShowPlaceReq {
  user: { user_id: number }
  place: { division: Division }
}
export interface ShowPlaceItem {
  place_name: string
  visit: boolean
}

export async function showPlace(userId: number, division: Division) {
  const body: ShowPlaceReq = { user: { user_id: userId }, place: { division } }
  const { data } = await api.post('/place/show_place', body) // POST 스펙
  // data.place: ShowPlaceItem[]
  return (data?.place ?? []) as ShowPlaceItem[]
}

export async function selectPlace(placeName: string) {
  const { data } = await api.post('/place/select_place', {
    place: { place_name: placeName },
  })
  return data?.place as {
    place_name: string
    category: string
    address: string
    business_hours: string
    menu: string[] // 명세엔 문자열 배열로 표기
  }
}

export async function searchPlace(keyword: string) {
  const { data } = await api.post('/place/search_place', { search: keyword })
  return (data?.results ?? []) as { place_name: string }[]
}

/** ✅ 방문기록 적재 (user_book)
 *  백엔드에서 실제 경로/파라미터 확인 필요. 아래는 흔한 패턴 예시.
 */
export async function markVisited(opts: { user_id: number; division: Division; place_id?: number; place_name?: string }) {
  // ⬇️ 팀원에게 확인: endpoint 이름 (예: /place/visit 또는 /user_book/insert 등), payload 키
  const { data } = await api.post('/place/visit', opts)
  return data
}
