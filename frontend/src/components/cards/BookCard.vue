<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  book: Object,
  currentUserId: Number
})
const emit = defineEmits(['exchange','edit','delete'])

const isOwner = computed(() => props.book.userId === props.currentUserId)

function onExchange(e) { e.stopPropagation(); emit('exchange', props.book) }
function onEdit(e)     { e.stopPropagation(); emit('edit', props.book) }
function onDelete(e)   { e.stopPropagation(); emit('delete', props.book) }

const defaultCover = 'https://via.placeholder.com/150x200?text=No+Cover'
</script>

<template>
  <div class="card h-100 shadow-sm text-decoration-none text-reset">
    <router-link :to="{ name: 'books-detail', params: { id: book.id } }">
      <img :src="book.coverUrl || defaultCover" class="card-img-top"/>
    </router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ book.title }}</h5>
      <p class="card-text text-muted mb-1">{{ book.author }}</p>
      <p v-if="book.genre" class="card-text mb-3">
        <small class="text-secondary">{{ book.genre }}</small>
      </p>
      <div class="mt-auto d-flex justify-content-between">
        <template v-if="book.status==='available' && !isOwner">
          <button class="btn btn-sm btn-outline-primary" @click="onExchange">
            <i class="bi bi-arrow-left-right me-1"></i> Tukar
          </button>
        </template>
        <template v-else-if="isOwner">
          <button class="btn btn-sm btn-outline-secondary" @click="onEdit">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="onDelete">
            <i class="bi bi-trash-fill"></i>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-img-top { height:180px; object-fit:cover; }
</style>
