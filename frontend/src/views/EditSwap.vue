<template>
  <Navbar />
  <Breadcrumb 
    :items="[
      { text:'Home', to:'/' },
      { text:'Books', to:'/books' },
      { text:'Edit Exchange', active:true }
    ]"
  />
  <div class="main-content py-4">
    <!-- 1. Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
    </div>

    <!-- 2. Error -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- 3. Form -->
    <div v-else>
      <h2 class="mb-4">Edit Request Pertukaran</h2>

      <!-- only allow edit when still pending -->
      <div v-if="exchange.status !== 'pending'" class="alert alert-warning">
        Hanya request dengan status <strong>pending</strong> yang bisa diedit.
      </div>
      <div v-else>
        <SwapForm
          :targetBook="targetBook"
          :myBooks="myBooks"
          :selectedId="selectedId"
          :form="form"
          title="Pilih Ulang Buku Anda"
          emptyMessage="Tidak ada buku yang tersedia untuk ditukar."
          submitText="Simpan Perubahan"
          cancelText="Batal"
          :showCancel="true"
          @submit="onSubmitEdit"
          @cancel="onCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar     from '@/components/layouts/Navbar.vue'
import Breadcrumb from '@/components/commons/Breadcrumb.vue'
import SwapForm   from '@/components/Form/SwapForm.vue'
import api        from '@/services/api.js'

const route   = useRoute()
const router  = useRouter()
const id      = Number(route.params.id)   // exchange id!

// state
const loading    = ref(true)
const error      = ref(null)
const exchange   = ref(null)
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
    // 1) Load the exchange detail
    const { exchange: ex } = await api.getExchangeDetail(id)
    exchange.value = ex

    // 2) Prefill form data
    selectedId.value  = ex.offeredBook.id
    form.message      = ex.messages || ''
    form.method       = ex.method   || 'meet'
    form.location     = ex.location || ''
    form.address      = ex.address  || ''
    if (ex.meetingDatetime) {
      form.date = ex.meetingDatetime.slice(0,10)
      form.time = ex.meetingDatetime.slice(11,16)
    }

    // 3) Set targetBook to the one being requested
    const rb = ex.requestedBook
    targetBook.value = {
      ...rb,
      coverUrl: rb.imageUrl || 'https://via.placeholder.com/300x400?text=No+Cover'
    }

    // 4) Load user's books (including the one they already offered)
    const { books } = await api.getMyBooks()
    myBooks.value = books
      .filter(b => b.status === 'available' || b.id === ex.offeredBook.id)
      .map(b => ({
        ...b,
        coverUrl: b.imageUrl || 'https://via.placeholder.com/200x300?text=No+Cover'
      }))
  } catch (e) {
    console.error('Gagal muat data edit:', e)
    error.value = e.response?.data?.message || 'Gagal memuat data edit.'
  } finally {
    loading.value = false
  }
})

async function onSubmitEdit({ selectedId: offeredBookId, form: f }) {
  try {
    await api.updateExchange(id, {
      offeredBookId,
      messages:        f.message,
      method:          f.method,
      location:        f.method === 'meet' ? f.location : undefined,
      address:         f.method === 'delivery' ? f.address : undefined,
      meetingDatetime: `${f.date}T${f.time}`
    })
    router.push({ name:'profile', query:{ tab:'history' } })
  } catch (e) {
    console.error('Gagal edit:', e)
    alert(e.response?.data?.message || 'Gagal mengubah request.')
  }
}

function onCancel() {
  router.back()
}
</script>

<style scoped>
/* Bootstrap styling sudah diaplikasikan */
</style>
