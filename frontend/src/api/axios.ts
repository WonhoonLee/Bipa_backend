// src/api/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => {
    // 모든 성공 응답을 콘솔에 보기 좋게 출력
    try {
      console.log(
        `[API OK] ${res.config.method?.toUpperCase()} ${res.config.url} ${res.status}\n` +
        JSON.stringify(res.data, null, 2)
      )
    } catch {}
    return res
  },
  (err) => {
    console.error(
      `[API ERR] ${err.config?.method?.toUpperCase()} ${err.config?.url} ${err.response?.status}`,
      err.response?.data || err.message
    )
    return Promise.reject(err)
  }
)

export default api
