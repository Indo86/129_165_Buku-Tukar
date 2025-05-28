<template>
  <Navbar />
  <Breadcrumb 
    :items="[
      { text:'Home', to:'/' },
      { text:'Books', to:'/books' },
      { text:'Exchange', active:true }
    ]"
  />
  <div class="main-content py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else>
      <h2 class="mb-4">Tukar Buku</h2>
      <SwapForm
        :targetBook="targetBook"
        :myBooks="myBooks"
        :selectedId="selectedId"
        :form="form"
        title="Pilih Buku Anda"
        emptyMessage="Anda tidak memiliki buku 'available' untuk ditukar."
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import Breadcrumb from '@/components/commons/Breadcrumb.vue'
import SwapForm from '@/components/Form/SwapForm.vue'
import api from '@/services/api.js'

// ambil bookId dari query param
const route      = useRoute()
const router     = useRouter()
const bookId     = Number(route.query.bookId)

// state
const loading    = ref(true)
const error      = ref(null)
const targetBook = ref({})
const myBooks    = ref([])
const selectedId = ref(null)
const form       = reactive({
  message: '',
  method: 'meet',
  location: '',
  address: '',
  date: '',
  time: ''
})

onMounted(async () => {
  try {
    // 1) ambil detail buku
    const { book: bk } = await api.getBookDetail(bookId)
    targetBook.value = {
      ...bk,
      coverUrl: bk.imageUrl || 'https://via.placeholder.com/300x400?text=No+Cover'
    }

    // 2) ambil semua buku user
    const { books } = await api.getMyBooks()
    myBooks.value = books
      .filter(b => b.status === 'available')
      .map(b => ({
        ...b,
        coverUrl: b.imageUrl || 'https://via.placeholder.com/200x300?text=No+Cover'
      }))

    // default selected
    if (myBooks.value.length) {
      selectedId.value = myBooks.value[0].id
    }
  } catch (e) {
    console.error('Gagal muat data swap:', e)
    error.value = 'Gagal memuat data tukar buku.'
  } finally {
    loading.value = false
  }
})

async function onSubmit({ selectedId: offeredBookId, form }) {
  try {
    await api.requestExchange({
      offeredBookId,
      requestedBookId: bookId,
      messages:        form.message,
      method:          form.method,
      location:        form.method === 'meet' ? form.location : undefined,
      address:         form.method === 'delivery' ? form.address : undefined,
      meetingDatetime: `${form.date}T${form.time}`
    })
    router.push({ name: 'profile', query: { tab: 'history' } })
  } catch (e) {
    console.error('Gagal request exchange:', e)
    alert(e.response?.data?.message || 'Gagal mengajukan tukar buku.')
  }
}
</script>

<style scoped>
/* Styling ringan: Bootstrap sudah include */
</style>
