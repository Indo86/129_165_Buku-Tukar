
<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: '',
    validator: v => ['', 'sm'].includes(v)
  },
  color: {
    type: String,
    default: 'primary',
    validator: v =>
      ['primary','secondary','success','danger','warning','info','light','dark'].includes(v)
  },
  message: {
    type: String,
    default: ''
  }
})

const spinnerSizeClass = computed(() => props.size === 'sm' ? 'spinner-border-sm' : '')
const textColorClass   = computed(() => `text-${props.color}`)
</script>



<template>
  <div v-if="visible" class="d-flex align-items-center">
    <div :class="['spinner-border', spinnerSizeClass, textColorClass]" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span v-if="message" class="ms-2">{{ message }}</span>
  </div>
</template>


