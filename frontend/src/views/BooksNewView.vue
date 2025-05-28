<template>
  <Navbar />
  <div class="main-content py-4">
    <Breadcrumb :items="[
      { text: 'Books', to: '/books' },
      { text: 'Post Books', to: '/books/new', active: true }
    ]" />
    <h1 class="mb-4">Posting Buku Baru</h1>
    <div class="card p-4">
      <BookForm
        :form="form"
        :errors="errors"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import Breadcrumb from '@/components/commons/Breadcrumb.vue'
import BookForm from '@/components/Form/BookForm.vue'
import api from '@/services/api.js'

const router = useRouter()
const form = reactive({
  title: '', author: '', genre: '',
  condition: 'Low', description: '', imageUrl: ''
})
const errors = reactive({ title: '', author: '' })

function validate() {
  let ok = true
  errors.title = ''
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

async function onSubmit() {
  if (!validate()) return
  try {
    await api.addBook({ ...form })
    alert(`Buku "${form.title}" berhasil diposting!`)
    router.push({ name: 'books' })
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Gagal posting buku.')
  }
}
</script>

<style scoped>
/* pakai Bootstrap */
</style>
