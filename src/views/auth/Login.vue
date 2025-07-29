<template>
  <div class="login-page">
    <!-- ✅ 이미지 로고 삽입 -->
    <img class="logo" src="@/assets/images/로고.png" alt="게임 첫 화면" />
    
    <button class="start-btn" @click="startGame">게임 시작하기</button>
  </div>
</template>

<script setup lang="ts">
function startGame() {
  window.Kakao.Auth.login({
    success: function (authObj: any) {
      console.log('✅ 로그인 성공', authObj)
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

.logo {
  width: 250px;   /* ✅ 원하는 크기로 조정 */
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
