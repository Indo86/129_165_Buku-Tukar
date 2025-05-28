<template>
  <form @submit.prevent="onSubmit">
    <!-- Judul -->
    <div class="mb-3">
      <label class="form-label">Judul Buku</label>
      <input
        v-model="form.title"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.title }"
        placeholder="Masukkan judul buku"
      />
      <div class="invalid-feedback">{{ errors.title }}</div>
    </div>

    <!-- Penulis -->
    <div class="mb-3">
      <label class="form-label">Penulis</label>
      <input
        v-model="form.author"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.author }"
        placeholder="Masukkan nama penulis"
      />
      <div class="invalid-feedback">{{ errors.author }}</div>
    </div>

    <!-- Genre -->
    <div class="mb-3">
      <label class="form-label">Genre</label>
      <input
        v-model="form.genre"
        type="text"
        class="form-control"
        placeholder="Misal: Novel, Programming"
      />
    </div>

    <!-- Kondisi -->
    <div class="mb-3">
      <label class="form-label">Kondisi</label>
      <select v-model="form.condition" class="form-select">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
    

    <div v-if="isEdit" class="mb-3">
      <label class="form-label">Status Buku</label>
      <select v-model="form.status" class="form-select">
        <option value="available">Available</option>
        <option value="in_exchange">In Exchange</option>
        <option value="exchanged">Exchanged</option>
        <option value="unavailable">Unavailable</option>
      </select>
    </div>


    <!-- Deskripsi -->
    <div class="mb-3">
      <label class="form-label">Deskripsi</label>
      <textarea
        v-model="form.description"
        class="form-control"
        rows="4"
        placeholder="Ceritakan sedikit tentang buku ini…"
      />
    </div>

    <!-- Image URL -->
    <div class="mb-4">
      <label class="form-label">Cover Image URL</label>
      <input
        v-model="form.imageUrl"
        type="url"
        class="form-control"
        placeholder="https://…"
      />
    </div>

    <!-- Buttons -->
    <div class="d-flex justify-content-end gap-2">
      <button type="submit" class="btn btn-primary">
        {{ isEdit ? 'Simpan Perubahan' : 'Posting Buku' }}
      </button>
      <router-link :to="cancelRoute" class="btn btn-secondary">Batal</router-link>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  form: { type: Object,   required: true },
  errors: { type: Object, required: true },
  isEdit: { type: Boolean, default: false },
  cancelRoute: { type: [String, Object], default: { name: 'books' } }
})
const emit = defineEmits(['submit'])
function onSubmit() {
  emit('submit')
}
</script>

<style scoped>
/* pakai Bootstrap */
</style>