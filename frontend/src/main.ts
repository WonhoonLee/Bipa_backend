import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 상태 관리 (필요 없으면 제거 가능)
import { createPinia } from 'pinia'

// Vuetify
import vuetify from './plugins/vuetify'            // ⬅ default export
import '@mdi/font/css/materialdesignicons.css'     // Vuetify 아이콘 폰트
import 'vuetify/styles'                            // Vuetify 기본 스타일

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(vuetify)

app.mount('#app')
