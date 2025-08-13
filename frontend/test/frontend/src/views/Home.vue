<template>
  <div>
    <h2>홈 페이지입니다.</h2>
    <button @click="goToLogin">로그인 하러 가기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>
