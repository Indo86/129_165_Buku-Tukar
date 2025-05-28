<template>
  <Navbar/>
  <div class="main-content py-4">
    <!-- Search & Filter -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-4">
        <input v-model="query" type="text" class="form-control" placeholder="Cari buku…" />
      </div>
      <div class="col-md-3">
        <select v-model="filterGenre" class="form-select">
          <option value="">Semua Genre</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
      <div class="col-md-5 text-end">
        <router-link to="/books/new" class="btn btn-success">+ Posting Buku</router-link>
      </div>
    </div>

    <!-- Grid -->
    <div class="row g-4">
      <div
        v-for="b in paginatedBooks"
        :key="b.id"
        class="col-sm-6 col-md-4 col-lg-3"
      >
        <BookCard
          :book="b"
          :current-user-id="userId"
          @edit="goToEdit"
          @delete="confirmDelete"
          @exchange="goToExchange"
        />
      </div>
      <div v-if="paginatedBooks.length===0" class="col-12 text-center text-muted">
        Tidak ada buku yang cocok.
      </div>
    </div>

    <!-- Pagination -->
    <nav class="mt-4" v-if="totalPages>1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page===1 }">
          <button class="page-link" @click="changePage(page-1)" :disabled="page===1">Previous</button>
        </li>
        <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: p===page }">
          <button class="page-link" @click="changePage(p)">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page===totalPages }">
          <button class="page-link" @click="changePage(page+1)" :disabled="page===totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar   from '@/components/layouts/Navbar.vue'
import BookCard from '@/components/cards/BookCard.vue'
import api      from '@/services/api.js'

const router      = useRouter()
const books       = ref([])
const userId      = ref(null)
const query       = ref('')
const filterGenre = ref('')
const page        = ref(1)
const perPage     = 8

onMounted(async () => {
  try {
    // 1) ambil profil
    const prof = await api.getProfile()
    userId.value = prof.data.data.id

    // 2) ambil semua buku, tapi destruct sesuai yang dikembalikan
    const { books: list } = await api.getAllBooks()
    books.value = list.map(b => ({
      ...b,
      coverUrl: b.imageUrl || 'https://via.placeholder.com/200x300?text=No+Cover'
    }))
  } catch (e) {
    console.error('Gagal memuat data:', e)
  }
})
  

const genres = computed(() =>
  Array.from(new Set(books.value.map(b => b.genre).filter(Boolean)))
)

const filteredBooks = computed(() =>
  books.value
    .filter(b =>
      ['available','in_exchange'].includes(b.status) &&
      b.title.toLowerCase().includes(query.value.toLowerCase()) &&
      (filterGenre.value === '' || b.genre === filterGenre.value)
    )
)

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / perPage))
const paginatedBooks = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredBooks.value.slice(start, start + perPage)
})

function changePage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
}

function goToEdit(book) {
  router.push({ name:'book-edit', params:{ id: book.id } })
}

async function confirmDelete(book) {
  if (!confirm(`Hapus buku "${book.title}"?`)) return
  await api.deleteBook(book.id)
  books.value = books.value.filter(b => b.id !== book.id)
}

function goToExchange(book) {
  router.push({ name:'books-swap', query:{ bookId: book.id } })
}
</script>

<style scoped>
/* Bootstrap sudah memadai */
</style>
  