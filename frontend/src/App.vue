<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts"></script>

<style>
html, body, #app { height: 100%; margin: 0; }
.v-application {            /* ← Vuetify가 까는 흰 배경 제거 */
  background: transparent !important;
}
</style>
