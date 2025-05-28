<!-- src/components/common/EditPasswordModal.vue -->
<script setup>
import { reactive, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    show:     { type: Boolean, required: true },
    oldError: { type: String,  default: '' }
  })

const emit = defineEmits(['close', 'save'])

// Form state
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation errors
const errors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Reset form & errors when modal opens
watch(
  () => props.show,
  val => {
    if (val) {
      form.oldPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
      errors.oldPassword = ''
      errors.newPassword = ''
      errors.confirmPassword = ''
    }
  }
)

function validate() {
  let ok = true
  // old password required
  if (!form.oldPassword) {
    errors.oldPassword = 'Password lama wajib diisi'
    ok = false
  } else {
    errors.oldPassword = ''
  }
  // new password length
  if (form.newPassword.length < 6) {
    errors.newPassword = 'Password baru minimal 6 karakter'
    ok = false
  } else {
    errors.newPassword = ''
  }
  // confirm matches
  if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok'
    ok = false
  } else {
    errors.confirmPassword = ''
  }
  return ok
}

function onSave() {
  if (!validate()) return
  // Emit only new password & old for backend
  emit('save', {
    oldPassword: form.oldPassword,
    newPassword: form.newPassword
  })
}

function onClose() {
  emit('close')
}
</script>

<template>
  <!-- Backdrop -->
  <div
    v-if="show"
    class="modal-backdrop fade show"
    @click="onClose"
  ></div>

  <!-- Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ganti Password</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="onClose"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSave">
            <!-- Password Lama -->
            <div class="mb-3">
              <label class="form-label">Password Lama</label>
              <input
                v-model="form.oldPassword"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.oldPassword }"
              />
              <div class="invalid-feedback">
                {{ errors.oldPassword || props.oldError }}
              </div>

            </div>

            <!-- Password Baru -->
            <div class="mb-3">
              <label class="form-label">Password Baru</label>
              <input
                v-model="form.newPassword"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.newPassword }"
              />
              <div class="invalid-feedback">{{ errors.newPassword }}</div>
            </div>

            <!-- Konfirmasi Password -->
            <div class="mb-3">
              <label class="form-label">Konfirmasi Password</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
              />
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="onClose"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="onSave"
          >
            Simpan Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background: transparent;
}
.modal-dialog {
  max-width: 420px;
}
</style>
