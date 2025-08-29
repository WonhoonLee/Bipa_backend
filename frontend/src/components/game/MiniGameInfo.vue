<!-- src/components/game/MiniGameInfo.vue -->
<template>
  <v-card class="w-100" variant="flat" rounded="lg">
    <v-card-title class="py-3 d-flex align-center ga-2">
      <v-icon icon="mdi-controller-classic" color="primary" />
      미니게임 안내
    </v-card-title>

    <v-divider />

    <v-list density="comfortable">
      <v-list-item>
        <template #prepend><v-icon icon="mdi-fish" /></template>
        <v-list-item-title>낚시</v-list-item-title>
        <v-list-item-subtitle>물고기를 잡아 포인트 획득</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <template #prepend><v-icon icon="mdi-octagram" /></template>
        <v-list-item-title>문어잡기</v-list-item-title>
        <v-list-item-subtitle>제한 시간 내 콤보 달성</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <template #prepend><v-icon icon="mdi-image-filter-hdr" /></template>
        <v-list-item-title>유달산</v-list-item-title>
        <v-list-item-subtitle>체크포인트 달성</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts"></script>
