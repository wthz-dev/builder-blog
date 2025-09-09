import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('@/pages/Home.vue')
const Post = () => import('@/pages/Post.vue')
const About = () => import('@/pages/About.vue')
const Contact = () => import('@/pages/Contact.vue')
const Login = () => import('@/pages/Login.vue')
const Register = () => import('@/pages/Register.vue')
const Privacy = () => import('@/pages/Privacy.vue')
const Admin = () => import('@/pages/Admin.vue')
const Profile = () => import('@/pages/Profile.vue')
const AdminPosts = () => import('@/pages/admin/Posts.vue')
const AdminEditPost = () => import('@/pages/admin/EditPost.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/post/:slug', name: 'post', component: Post, meta: { title: 'Post' } },
  // Category/Tag pages reuse Home for filtered views to keep UX consistent
  { path: '/category/:slug', name: 'category', component: Home, meta: { title: 'Category' } },
  { path: '/tag/:slug', name: 'tag', component: Home, meta: { title: 'Tag' } },

  { path: '/about', name: 'about', component: About, meta: { title: 'About' } },
  { path: '/contact', name: 'contact', component: Contact, meta: { title: 'Contact' } },
  { path: '/privacy-policy', name: 'privacy', component: Privacy, meta: { title: 'Privacy Policy' } },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/register', name: 'register', component: Register, meta: { title: 'Register' } },
  // Legacy admin (kept for compatibility)
  { path: '/admin', name: 'admin', component: Admin, meta: { title: 'Admin' } },
  // New admin structure
  { path: '/admin/posts', name: 'admin-posts', component: AdminPosts, meta: { title: 'Posts' } },
  { path: '/admin/posts/new', name: 'admin-posts-new', component: AdminEditPost, meta: { title: 'New Post' } },
  { path: '/admin/posts/:id/edit', name: 'admin-posts-edit', component: AdminEditPost, meta: { title: 'Edit Post' } },
  { path: '/profile', name: 'profile', component: Profile, meta: { title: 'Profile' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
