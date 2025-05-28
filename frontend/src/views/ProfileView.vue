<!-- src/views/ProfileView.vue -->
<template>
  <Navbar/>

  <div v-if="user.id" class="main-content py-4">
    <!-- 1. Header & Profile Card -->
    <h1 class="mb-4">Profile Saya</h1>
    <div class="row mb-5 justify-content-center">
      <div class="col-md-4">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <img
              :src="user.avataUrl || defaultAvatar"
              class="rounded-circle mb-3"
              width="120" height="120"
            />
            <h4 class="card-title">{{ user.username }}</h4>
            <p class="card-text text-muted mb-1">{{ user.email }}</p>
            <div class="d-flex justify-content-center gap-2 mt-3">
              <button @click="showProfileModal = true" class="btn btn-outline-primary">
                <i class="bi bi-pencil-fill me-1"></i>Edit Profil
              </button>
              <button @click="showPwdModal = true" class="btn btn-outline-warning">
                <i class="bi bi-key-fill me-1"></i>Ganti Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Statistik -->
      <div class="col-md-8">
        <div class="row g-3">
          <div class="col-6">
            <div class="card text-white bg-success h-100">
              <div class="card-body">
                <h6 class="card-title">My Books</h6>
                <p class="display-6">{{ books.length }}</p>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card text-white bg-info h-100">
              <div class="card-body">
                <h6 class="card-title">Riwayat</h6>
                <p class="display-6">{{ history.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'books' }"
          @click="activeTab = 'books'"
        >My Books</button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >History</button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'archive' }"
          @click="activeTab = 'archive'"
        >Archive</button>
      </li>
    </ul>

    <!-- 4a. My Books -->
    <section v-if="activeTab === 'books'">
      <div class="row g-4">
        <div
          v-for="b in books.filter(b => ['available','in_exchange'].includes(b.status))"
          :key="b.id"
          class="col-sm-6 col-md-4 col-lg-3"
        >
          <BookCard
            :book="b"
            :current-user-id="user.id"
            @edit="goToEdit"
            @delete="confirmDelete"
          />
        </div>
        <div
          v-if="books.filter(b => ['available','in_exchange'].includes(b.status)).length === 0"
          class="col-12 text-center text-muted"
        >Belum ada buku untuk ditampilkan.</div>
      </div>
    </section>

    <!-- 4b. History -->
    <section v-else-if="activeTab === 'history'">
      <h2 class="mb-3">Riwayat Penukaran</h2>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Buku Diminta</th>
              <th>Buku Ditawarkan</th>
              <th>Dengan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h in history"
              :key="h.id"
              class="clickable-row"
             @click="goDetail(h.id)"
            >
              <td>{{ formatDate(h.date) }}</td>
              <td  >{{ h.bookRequested.title }}</td>
              <td>{{ h.bookOffered.title }}</td>
              <td>{{ h.partner.username }}</td>
              <td>
                <span :class="['badge', statusClass(h.status)]">{{ h.status }}</span>
              </td>
            </tr>
            <tr v-if="history.length === 0">
              <td colspan="5" class="text-center text-muted">
                Belum ada riwayat penukaran.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 4c. Archive -->
    <section v-else-if="activeTab === 'archive'">
      <h2 class="mb-3">Archive</h2>
      <div class="row g-4">
        <div
          v-for="b in books.filter(b => ['exchanged','unavailable'].includes(b.status))"
          :key="b.id"
          class="col-sm-6 col-md-4 col-lg-3"
        >
          <BookCard
            :book="b"
            :current-user-id="user.id"
            @edit="goToEdit"
            @delete="confirmDelete"
          />
        </div>
        <div
          v-if="books.filter(b => ['exchanged','unavailable'].includes(b.status)).length === 0"
          class="col-12 text-center text-muted"
        >Belum ada arsip buku.</div>
      </div>
    </section>

    <!-- 5. Modals -->
    <EditProfileModal
      :show="showProfileModal"
      :user="user"
      @close="showProfileModal = false"
      @save="onUpdateProfile"
    />
    <EditPasswordModal
      :show="showPwdModal"
      @close="showPwdModal = false"
      @save="onChangePassword"
    />
  </div>

  <!-- Loading Spinner -->
  <div v-else class="text-center my-5">
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import BookCard from '@/components/cards/BookCard.vue'
import EditProfileModal from '@/components/modals/EditProfileModal.vue'
import EditPasswordModal from '@/components/modals/EditPasswordModal.vue'
import api from '@/services/api.js'

const router           = useRouter()
const user             = ref({})
const books            = ref([])
const history          = ref([])
const activeTab        = ref('books')
const defaultAvatar    = 'https://via.placeholder.com/120?text=Avatar'
const showProfileModal = ref(false)
const showPwdModal     = ref(false)

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('id-ID',{
    day:'numeric', month:'short', year:'numeric'
  })
}

function statusClass(s) {
  if (s === 'accepted') return 'bg-success'
  if (s === 'declined') return 'bg-danger'
  return 'bg-warning text-dark'
}

function goToEdit(b) {
  router.push({ name:'book-edit', params:{ id: b.id }})
}


async function confirmDelete(b) {
  if (!confirm(`Hapus buku “${b.title}”?`)) return
  await api.deleteBook(b.id)
  books.value = books.value.filter(x => x.id !== b.id)
}

function goDetail(id) {
  router.push({ name:'request-detail', params:{ id }})
}

// —————— handlers for modals ——————
async function onUpdateProfile(updated) {
  try {
    await api.updateProfile(updated)
    Object.assign(user.value, updated)
    alert('Profil berhasil diperbarui!')
    showProfileModal.value = false
  } catch (err) {
    console.error('Update profil gagal:', err)
    alert(err.response?.data?.message || 'Gagal memperbarui profil.')
  }
}

async function onChangePassword({ oldPassword, newPassword }) {
  try {
    await api.changePassword(oldPassword, newPassword)
    alert('Password berhasil diperbarui!')
    showPwdModal.value = false
  } catch (err) {
    console.error('Ganti password gagal:', err)
    alert(err.response?.data?.message || 'Gagal mengganti password.')
  }
}

// —————— initial data load ——————
onMounted(async () => {
  try {
    // profile
    const p = await api.getProfile()
    user.value = p.data.data

    // my books
    const { books: myBooks } = await api.getMyBooks()
    books.value = myBooks.map(b => ({
      ...b,
      coverUrl: b.imageUrl || 'https://via.placeholder.com/200x300?text=No+Cover'
    }))

    // sent exchanges
    const { exchanges } = await api.getMyExchangeRequests()
    history.value = exchanges.map(e => ({
      id:            e.id,
      date:          e.createdAt,
      bookRequested: e.requestedBook,
      bookOffered:   e.offeredBook,
      partner:       e.owner,
      status:        e.status
    }))
  } catch (err) {
    console.error('Load data gagal:', err)
  }
})
</script>

<style scoped>
.clickable-row { cursor: pointer; }
.clickable-row:hover { background-color: #f8f9fa; }
</style>
