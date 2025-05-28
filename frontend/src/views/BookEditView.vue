<!-- src/views/BookEditView.vue -->
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import Breadcrumb from '@/components/commons/Breadcrumb.vue'
import BookForm from '@/components/Form/BookForm.vue'
import api from '@/services/api.js'

const route  = useRoute()
const router = useRouter()

// state
const book    = ref(null)   // nanti diisi object buku
const loading = ref(true)   // loading spinner
const form    = reactive({
  title:       '',
  author:      '',
  genre:       '',
  condition:   'Low',
  description: '',
  imageUrl:    ''
})
const errors  = reactive({ title:'', author:'' })

// 1) ambil detail buku saat mounted
onMounted(async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    // kalau param id bukan angka, kembali ke daftar
    return router.replace({ name: 'books' })
  }

  try {
    const { book: b } = await api.getBookDetail(id)
    book.value = b
    // isi form dari data yg sudah ada
    Object.assign(form, {
      title:       b.title,
      author:      b.author,
      genre:       b.genre,
      condition:   b.condition,
      status: b.status,     
      description: b.description,
      imageUrl:    b.imageUrl
    })
  } catch (e) {
    console.error('Gagal memuat detail buku:', e)
    // kalau gagal ambil detail, kembali ke halaman list
    return router.replace({ name: 'books' })
  } finally {
    loading.value = false
  }
})

// 2) Breadcrumb items, tunggu sampai `book.value` siap
const breadcrumbItems = computed(() => {
  const items = [
    { text: 'Books', to: '/books' }
  ]
  if (book.value) {
    items.push({
      text: book.value.title,
      to:   { name: 'books-detail', params: { id: book.value.id } }
    })
  } else {
    items.push({ text: 'Loading…', active: true })
  }
  items.push({ text: 'Edit', active: true })
  return items
})

// 3) Validasi sederhana
function validate() {
  let ok = true
  errors.title  = ''
  errors.author = ''
  if (!form.title.trim()) {
    errors.title = 'Judul buku wajib diisi.'
    ok = false
  }
  if (!form.author.trim()) {
    errors.author = 'Nama penulis wajib diisi.'
    ok = false
  }
  return ok
}

// 4) Submit form
async function onSubmit() {
  if (!validate()) return

  try {
    await api.updateBook(book.value.id, { ...form, status: form.status })
    alert('Buku berhasil diperbarui!')
    router.push({ name: 'books-detail', params: { id: book.value.id } })
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Gagal memperbarui buku.')
  }
}
</script>

<template>
  <Navbar/>

  <div class="main-content py-4">
    <!-- Breadcrumb: selalu render, tapi items-nya menunggu `book.value` -->
    <Breadcrumb :items="breadcrumbItems" />

    <h1 class="mb-4">Edit Buku</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <!-- Form -->
    <div v-else class="card p-4">
      <BookForm
        :form="form"
        :errors="errors"
        :isEdit="true"
        :cancelRoute="{ name: 'books-detail', params: { id: book.id } }"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
/* styling dasar dari Bootstrap sudah cukup */
</style>
