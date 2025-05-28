<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  type: {
    type: String,
    default: "default",
    validator: (value) => [
      "default", 
      "primary", 
      "danger", 
      "success", 
      "warning", 
      "secondary", 
      "light"
    ].includes(value)
  },
  class: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const buttonClass = computed(() => ({
  "btn-primary": props.type === "primary",
  "btn-danger": props.type === "danger",
  "btn-success": props.type === "success",
  "btn-warning": props.type === "warning",
  "btn-secondary": props.type === "secondary",
  "btn-light": props.type === "light",
  "btn-default": props.type === "default",
}));

// Emits
const emit = defineEmits(['click']);
</script>

<template>
  <button 
    :class="['base-button', buttonClass, props.class]" 
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary { 
  background: #007bff; 
  color: white; 
}

.btn-danger { 
  background: #dc3545; 
  color: white; 
}

.btn-success { 
  background: #28a745; 
  color: white; 
}

.btn-warning { 
  background: #ffc107; 
  color: black; 
}

.btn-secondary { 
  background: #6c757d; 
  color: white; 
}

.btn-light { 
  background: #f8f9fa; 
  color: #212529; 
  border: 1px solid #d3d4d5;
}

.btn-default {
  background: #e9ecef;
  color: #212529;
}

.base-button:hover {
  opacity: 0.85;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Add icon support */
.base-button i {
  margin-right: 5px;
}
</style>