<template>
  <Navbar/>

  <div class="main-content py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <h1 class="h3 mb-4">Selamat datang, {{ userName }}!</h1>

      <!-- Statistik Ringkas -->
      <div class="row mb-5">
        <div
          v-for="stat in [
            { title: 'Total Buku', count: totalBooks },
            { title: 'Request Pending', count: pendingRequests },
            { title: 'Tukar Sukses', count: successfulTrades }
          ]"
          :key="stat.title"
          class="col-md-3 mb-3"
        >
          <div class="card text-white bg-primary h-100">
            <div class="card-body">
              <h5 class="card-title">{{ stat.title }}</h5>
              <p class="card-text display-4">{{ stat.count }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Request Masuk -->
      <h5>Request Masuk</h5>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>No</th>
            <th>Pengirim</th>
            <th>Buku Diminta</th>
            <th>Buku Ditawarkan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in incomingRequests"
            :key="r.id"
            class="clickable-row"
            @click="goDetail(r.id)"
          >
            <td>{{ r.id }}</td>
            <td>{{ r.requester.username }}</td>
            <td>{{ r.requestedBook.title }}</td>
            <td>{{ r.offeredBook.title }}</td>
            <td>
              <span :class="['badge', statusClass(r.status)]">
                {{ r.status }}
              </span>
            </td>
            <td @click.stop>
              <template v-if="r.status === 'pending'">
                <BaseButton
                  type="success"
                  class="me-2"
                  @click="respond(r.id, 'accepted')"
                >
                  <i class="bi bi-check-lg"></i>Terima
                </BaseButton>
                <BaseButton
                  type="danger"
                  @click="respond(r.id, 'declined')"
                >
                  <i class="bi bi-x-lg"></i>Tolak
                </BaseButton>
              </template>
              <span v-else class="text-muted">—</span>
            </td>
          </tr>
          <tr v-if="incomingRequests.length === 0">
            <td colspan="6" class="text-center text-muted">
              Belum ada request.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import api from '@/services/api.js'

const router          = useRouter()
const userName        = ref('')
const totalBooks      = ref(0)
const pendingRequests = ref(0)
const successfulTrades= ref(0)
const totalPosts      = ref(0)
const incomingRequests= ref([])
const loading         = ref(true)
const error           = ref(null)

function statusClass(s) {
  if (s === 'accepted') return 'bg-success'
  if (s === 'declined') return 'bg-danger'
  return 'bg-warning text-dark'
}

async function loadIncoming() {
  const { exchanges } = await api.getReceivedExchanges()
  incomingRequests.value = exchanges
  pendingRequests.value  = exchanges.filter(e => e.status === 'pending').length
}

async function respond(id, action) {
  if (!confirm(`Anda yakin ingin ${action==='accepted'?'menerima':'menolak'} request #${id}?`))
    return
  try {
    await api.updateExchangeStatus(id, action)
    await loadIncoming()
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal merespon request.')
  }
}

function goDetail(id) {
  router.push({ name: 'request-detail', params: { id } })
}

onMounted(async () => {
  try {
    const p = await api.getProfile()
    userName.value = p.data.data.username

    const { books } = await api.getMyBooks()
    totalBooks.value = books.length

    await loadIncoming()

    const { exchanges: sent } = await api.getMyExchangeRequests()
    successfulTrades.value = sent.filter(e => e.status === 'accepted').length
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover {
  background-color: #f8f9fa;
}
</style>
