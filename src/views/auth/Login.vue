<template>
  <div class="login-page">
    <h1 class="title">🍐 비파 키우기</h1>
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
function startGame() {
  // ✅ 카카오 로그인 팝업 실행
  window.Kakao.Auth.login({
    success: function (authObj: any) {
      console.log('✅ 로그인 성공', authObj)
      // 로그인 성공 후 게임 페이지로 이동
      window.location.href = '/game'
    },
    fail: function (err: any) {
      console.error('❌ 로그인 실패', err)
    }
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fff;
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #fbc531;
  margin-bottom: 30px;
}

.start-btn {
  background-color: #FEE500;
  border: none;
  padding: 15px 30px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

.start-btn:hover {
  background-color: #ffde00;
}
</style>
