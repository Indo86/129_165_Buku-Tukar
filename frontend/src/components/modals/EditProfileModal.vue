
<script setup>
import { reactive, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  user: {
    type: Object,
    required: true,
    // { id, username, email, whatsappNumber, addressUser, avatarUrl }
  }
})
const emit = defineEmits(['close', 'save'])

// Local copy of user data
const form = reactive({
  username: '',
  email: '',
  whatsappNumber: '',
  addressUser: '',
  avatarUrl: ''
})

// Validation errors
const errors = reactive({
  username: '',
  email: ''
})

// Sync form when modal opens
watch(() => props.show, open => {
  if (open) {
    form.username       = props.user.username       || ''
    form.email          = props.user.email          || ''
    form.whatsappNumber = props.user.whatsappNumber || ''
    form.addressUser    = props.user.addressUser    || ''
    form.avatarUrl     = props.user.avatarUrl     || ''
    errors.username = ''
    errors.email    = ''
  }
})

function validate() {
  let ok = true
  if (!form.username.trim()) {
    errors.username = 'Username wajib diisi'
    ok = false
  } else {
    errors.username = ''
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email tidak valid'
    ok = false
  } else {
    errors.email = ''
  }
  return ok
}

function onSave() {
  if (!validate()) return
  emit('save', {
    username:       form.username,
    email:          form.email,
    whatsappNumber: form.whatsappNumber,
    addressUser:    form.addressUser,
    avatarUrl:     form.avatarUrl
  })
}

function onClose() {
  emit('close')
}
</script>

<template>
  <!-- backdrop -->
  <div v-if="show" class="modal-backdrop fade show" @click="onClose"></div>

  <!-- modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Profil</h5>
          <button type="button" class="btn-close" @click="onClose"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="onSave">
            <!-- Username -->
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
              />
              <div class="invalid-feedback">{{ errors.username }}</div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <!-- WhatsApp Number -->
            <div class="mb-3">
              <label class="form-label">WhatsApp Number</label>
              <input
                v-model="form.whatsappNumber"
                type="text"
                class="form-control"
                placeholder="0812xxxxxxx"
              />
            </div>

            <!-- Address -->
            <div class="mb-3">
              <label class="form-label">Address</label>
              <input
                v-model="form.addressUser"
                type="text"
                class="form-control"
                placeholder="Alamat lengkap..."
              />
            </div>

            <!-- Avatar URL -->
            <div class="mb-3">
              <label class="form-label">Avatar URL</label>
              <input
                v-model="form.avatarUrl"
                type="url"
                class="form-control"
                placeholder="https://..."
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="onClose">Batal</button>
          <button class="btn btn-primary" @click="onSave">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal { background: transparent; }
.modal-dialog { max-width: 500px; }
body.modal-open { overflow: hidden; }
</style>
