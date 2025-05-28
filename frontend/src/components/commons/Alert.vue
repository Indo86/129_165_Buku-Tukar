<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: val =>
      ['primary','secondary','success','danger','warning','info','light','dark'].includes(val)
  },
  message: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const visible = ref(true)

function handleClose() {
  visible.value = false
  emit('close')
}
</script>


<template>
  <div
    v-if="visible"
    :class="['alert', 'alert-${type}', 'd-flex', 'align-items-center']"
    role="alert"
  >
    <slot>{{ message }}</slot>
    <button
      v-if="closable"
      type="button"
      class="btn-close ms-auto"
      aria-label="Close"
      @click="handleClose"
    ></button>
  </div>
</template>
