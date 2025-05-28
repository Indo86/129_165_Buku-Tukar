<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterCard from '@/components/cards/RegisterCard.vue'
import api from '@/services/api.js'

const router = useRouter()
const error = ref(null)

async function registerUser(formData) {
  error.value = null
  try {
    await api.register(formData)
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registrasi gagal'
  }
}
</script>

<template>
  <div class="container">
    <div class="layout-wraper flex flex-col align-items-center justify-content-center">
      <RegisterCard @register="registerUser" />
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.layout-wraper {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.alert {
  max-width: 450px;
}
</style>