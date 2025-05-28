import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import BooksListView from '@/views/BooksListView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import BooksNewView from '@/views/BooksNewView.vue'
import BooksDetailView from '@/views/BooksDetailView.vue'
import BooksSwap from '@/views/BooksSwap.vue'
import RequestDetailView from '@/views/RequestDetailView.vue'
import BookEditView from '@/views/BookEditView.vue'
import EditSwap from '@/views/EditSwap.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
 { path: '/',                name: 'home',          component: HomeView },
  { path: '/login',           name: 'login',         component: LoginView },
  { path: '/register',        name: 'register',      component: RegisterView },

  // semua halaman setelah ini membutuhkan auth
  { path: '/profile',         name: 'profile',       component: ProfileView },
  { path: '/books',           name: 'books',         component: BooksListView },
  { path: '/books/new',       name: 'books-new',     component: BooksNewView },
  {
    path: '/books/:id',
    name: 'books-detail',
    component: BooksDetailView,
    props: true,          // biar route.params.id diteruskan ke props.id
  },

  { 
    path: '/books/swap',      // swap dijalankan via query ?bookId=…
    name: 'books-swap',       
    component: BooksSwap 
  },
  { 
    path: '/books/swap/edit/:id',      // swap dijalankan via query ?bookId=…
    name: 'book-swap-edit',       
    component: EditSwap, 
  },
 {
    path: '/exchange/requests/:id',
    name: 'request-detail',
    component: RequestDetailView,
    props: true
  },
  {
    path: '/book/edit/:id',
    name: 'book-edit',
    component: BookEditView,
  },

  ],
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('accessToken');
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});


export default router
