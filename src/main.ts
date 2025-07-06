import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useUser } from './store/User' // ✅ 사용자 상태 불러오기

// ✅ 로그인 유지: 앱 시작 시 localStorage에서 nickname 불러오기
const { loadNickname } = useUser()
loadNickname()

const app = createApp(App)
app.use(router)
app.mount('#app')
