<template>
  <div class="row">
    <div class="col-md-4 text-center">
      <img :src="targetBook.coverUrl" class="img-fluid rounded mb-3" />
      <h5>{{ targetBook.title }}</h5>
      <p class="text-muted">by {{ targetBook.author }}</p>
    </div>
    <div class="col-md-8">
      <h5>{{ title }}</h5>
      <div class="row g-3">
        <div v-for="b in myBooks" :key="b.id" class="col-sm-6 col-lg-4">
          <label class="card h-100 cursor-pointer" :class="{ 'border-primary': selectedId === b.id }">
          <input
            type="radio"
            class="visually-hidden"
            :value="b.id"
            :checked="selectedId === b.id"
            @change="$emit('update:selectedId', b.id)"
          />
            <img :src="b.coverUrl" class="card-img-top" />
            <div class="card-body">
              <h6 class="card-title mb-1">{{ b.title }}</h6>
              <p class="text-muted small">{{ b.author }}</p>
            </div>
          </label>
        </div>
        <div v-if="!myBooks.length" class="col-12 text-center text-muted">
          {{ emptyMessage }}
        </div>
      </div>
      <div v-if="myBooks.length" class="mt-4">
        <div class="mb-3">
          <label class="form-label">Pesan</label>
          <textarea class="form-control" rows="3" v-model="form.message" />
        </div>
        <div class="mb-3">
          <label class="form-label">Metode</label>
          <div>
            <div class="form-check form-check-inline" v-for="opt in methods" :key="opt.value">
              <input
                class="form-check-input"
                type="radio"
                v-model="form.method"
                :value="opt.value"
                :id="opt.value"
              />
              <label class="form-check-label" :for="opt.value">{{ opt.label }}</label>
            </div>
          </div>
        </div>
        <div v-if="form.method==='delivery'" class="mb-3">
          <label class="form-label">Alamat</label>
          <input class="form-control" v-model="form.address" />
        </div>
        <div v-else class="mb-3">
          <label class="form-label">Lokasi</label>
          <input class="form-control" v-model="form.location" />
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <label class="form-label">Tanggal</label>
            <input type="date" class="form-control" v-model="form.date" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Waktu</label>
            <input type="time" class="form-control" v-model="form.time" />
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="$emit('submit', { selectedId, form })">
            {{ submitText }}
          </button>
          <button v-if="showCancel" class="btn btn-secondary" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  targetBook: Object,
  myBooks: Array,
  selectedId: [Number, String],
  form: Object,
  title: String,
  emptyMessage: String,
  methods: { type: Array, default: () => [
    { value:'meet', label:'Ketemuan' },
    { value:'delivery', label:'Kirim Kurir' }
  ] },
  submitText: { type:String, default:'Kirim Request' },
  cancelText: { type:String, default:'Batal' },
  showCancel: { type:Boolean, default:false }
})
</script>

<style scoped>
.card { cursor:pointer; transition:border-color .2s; }
.card.border-primary { border-width:2px!important; }
</style>