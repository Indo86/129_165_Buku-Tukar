<script setup>
import { ref } from 'vue';
import BaseButton from '../buttons/BaseButton.vue';

const emit = defineEmits(['register']);

// State untuk mengontrol tahap registrasi
const currentStep = ref(1);

// Data pribadi (tahap 1)
const username = ref('');
const whatsappNumber = ref('');
const addressUser = ref('');
const avatarUrl = ref('');

// Data akun (tahap 2)
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Validasi tahap 1
const validateStep1 = () => {
  return username.value.trim() && 
         whatsappNumber.value.trim() && 
         addressUser.value.trim();
};

// Pindah ke tahap 2
const nextStep = () => {
  if (validateStep1()) {
    currentStep.value = 2;
  }
};

// Kembali ke tahap 1
const prevStep = () => {
  currentStep.value = 1;
};

// Validasi tahap 2
const validateStep2 = () => {
  return email.value.trim() && 
         password.value && 
         confirmPassword.value &&
         password.value === confirmPassword.value;
};

// Submit registrasi
const registerUser = () => {
  if (validateStep2()) {
    emit('register', {
      username: username.value.trim(),
      whatsappNumber: whatsappNumber.value.trim(),
      addressUser: addressUser.value.trim(),
      avatarUrl: avatarUrl.value.trim() || null,
      email: email.value.trim(),
      password: password.value
    });
    
    // Reset form
    resetForm();
  }
};

// Reset semua form
const resetForm = () => {
  currentStep.value = 1;
  username.value = '';
  whatsappNumber.value = '';
  addressUser.value = '';
  avatarUrl.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
};

// Handle file upload untuk avatar
const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="card register-card">
    <div class="card-header">
      <i class="bi-person-plus-fill register-icon"></i>
      <h2>Tukarbaca Register</h2>
      <div class="steps-indicator">
        <div class="step" :class="{ active: currentStep >= 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Data Pribadi</span>
        </div>
        <div class="step-connector" :class="{ active: currentStep >= 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Akun</span>
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <!-- Tahap 1: Data Pribadi -->
      <div v-if="currentStep === 1" class="step-content">
        <h4 class="step-title mb-4">Data Pribadi</h4>
        <form @submit.prevent="nextStep">
          <div class="form-floating mb-3">
            <input 
              type="text" 
              class="form-control" 
              id="username" 
              placeholder="Username" 
              v-model="username" 
              required
            >
            <label for="username">
              <i class="bi-person-fill me-2"></i>Username
            </label>
          </div>
          
          <div class="form-floating mb-3">
            <input 
              type="tel" 
              class="form-control" 
              id="whatsapp" 
              placeholder="Nomor WhatsApp" 
              v-model="whatsappNumber" 
              required
            >
            <label for="whatsapp">
              <i class="bi-whatsapp me-2"></i>Nomor WhatsApp
            </label>
          </div>
          
          <div class="form-floating mb-3">
            <textarea 
              class="form-control" 
              id="address" 
              placeholder="Alamat" 
              v-model="addressUser" 
              style="min-height: 100px;"
              required
            ></textarea>
            <label for="address">
              <i class="bi-geo-alt-fill me-2"></i>Alamat
            </label>
          </div>
          
          <div class="mb-3">
            <label for="avatar" class="form-label">
              <i class="bi-camera-fill me-2"></i>Avatar (Opsional)
            </label>
            <input 
              type="file" 
              class="form-control" 
              id="avatar" 
              accept="image/*"
              @change="handleAvatarUpload"
            >
            <div v-if="avatarUrl" class="avatar-preview mt-2">
              <img :src="avatarUrl" alt="Avatar Preview" class="preview-image">
            </div>
          </div>
          
          <BaseButton 
            type="primary" 
            class="w-100" 
            @click="nextStep"
            :disabled="!validateStep1()"
          >
            Selanjutnya
            <i class="bi-arrow-right ms-2"></i>
          </BaseButton>
        </form>
      </div>
      
      <!-- Tahap 2: Email & Password -->
      <div v-if="currentStep === 2" class="step-content">
        <h4 class="step-title mb-4">Buat Akun</h4>
        <form @submit.prevent="registerUser">
          <div class="form-floating mb-3">
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              placeholder="nama@contoh.com" 
              v-model="email" 
              required
            >
            <label for="email">
              <i class="bi-envelope-fill me-2"></i>Email
            </label>
          </div>
          
          <div class="form-floating mb-3">
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              placeholder="Password" 
              v-model="password" 
              required
            >
            <label for="password">
              <i class="bi-lock-fill me-2"></i>Password
            </label>
          </div>
          
          <div class="form-floating mb-3">
            <input 
              type="password" 
              class="form-control" 
              id="confirmPassword" 
              placeholder="Konfirmasi Password" 
              v-model="confirmPassword" 
              required
              :class="{ 'is-invalid': confirmPassword && password !== confirmPassword }"
            >
            <label for="confirmPassword">
              <i class="bi-lock-check-fill me-2"></i>Konfirmasi Password
            </label>
            <div v-if="confirmPassword && password !== confirmPassword" class="invalid-feedback">
              Password tidak cocok
            </div>
          </div>
          
          <div class="button-group">
            <BaseButton 
              type="secondary" 
              @click="prevStep"
              class="flex-fill me-2"
            >
              <i class="bi-arrow-left me-2"></i>Kembali
            </BaseButton>
            <BaseButton 
              type="primary" 
              @click="registerUser"
              class="flex-fill"
              :disabled="!validateStep2()"
            >
              Daftar
              <i class="bi-check-lg ms-2"></i>
            </BaseButton>
          </div>
        </form>
      </div>
      
      <div class="login-link mt-4 text-center">
        <p>Sudah punya akun? <router-link to="/login">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-card {
  max-width: 450px;
  width: 100%;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  text-align: center;
  padding: 25px;
  border-bottom: none;
}

.card-header h2 {
  margin-bottom: 20px;
  font-weight: 700;
}

.register-icon {
  font-size: 50px;
  margin-bottom: 15px;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
  transition: background 0.3s ease;
}

.step.active .step-number {
  background: rgba(255, 255, 255, 0.9);
  color: #4e73df;
}

.step-label {
  font-size: 12px;
  font-weight: 500;
}

.step-connector {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.step-connector.active {
  background: rgba(255, 255, 255, 0.6);
}

.card-body {
  padding: 30px;
}

.step-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-title {
  color: #4e73df;
  font-weight: 600;
  border-bottom: 2px solid #f8f9fc;
  padding-bottom: 10px;
}

.form-floating label {
  color: #6c757d;
}

.form-control:focus, .form-select:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.avatar-preview {
  display: flex;
  justify-content: center;
}

.preview-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4e73df;
}

.button-group {
  display: flex;
  gap: 10px;
}

.login-link a {
  color: #4e73df;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>