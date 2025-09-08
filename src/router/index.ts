import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('@/pages/Home.vue')
const Post = () => import('@/pages/Post.vue')
const About = () => import('@/pages/About.vue')
const Contact = () => import('@/pages/Contact.vue')
const Login = () => import('@/pages/Login.vue')
const Register = () => import('@/pages/Register.vue')
const Admin = () => import('@/pages/Admin.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/post/:slug', name: 'post', component: Post, meta: { title: 'Post' } },
  // Category/Tag pages reuse Home for filtered views to keep UX consistent
  { path: '/category/:slug', name: 'category', component: Home, meta: { title: 'Category' } },
  { path: '/tag/:slug', name: 'tag', component: Home, meta: { title: 'Tag' } },

  { path: '/about', name: 'about', component: About, meta: { title: 'About' } },
  { path: '/contact', name: 'contact', component: Contact, meta: { title: 'Contact' } },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/register', name: 'register', component: Register, meta: { title: 'Register' } },
  { path: '/admin', name: 'admin', component: Admin, meta: { title: 'Admin' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
