<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    item: { text: '', to: '', active: false } 
  }
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(item, idx) in items"
        :key="idx"
        :class="['breadcrumb-item', { active: item.active }]"
        aria-current="item.active ? 'page' : null"
      >
        <template v-if="!item.active">
          <router-link :to="item.to">{{ item.text }}</router-link>
        </template>
        <template v-else>
          {{ item.text }}
        </template>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* Kalau mau override spacing atau warna */
.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1rem;
}
</style>
