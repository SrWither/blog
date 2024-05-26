import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

import AdminView from '@/views/admin/AdminView.vue'

import AdminCatView from '@/views/admin/CategoryCreate.vue'
import AdminCatDetView from '@/views/admin/CategoryDetails.vue'
import AdminCatEdView from '@/views/admin/CategoryEdit.vue'

import CreatePost from '@/views/posts/CreatePost.vue'
import PostsView from '@/views/posts/PostsView.vue'
import PostView from '@/views/posts/PostView.vue'
import EditPost from '@/views/posts/EditPost.vue'

import authMiddleware from '@/middlewares/auth'
import adminMiddleware from '@/middlewares/admin'
import PageNotFound from '@/views/PageNotFound.vue'
import PageForbidden from '@/views/PageForbidden.vue'
import CallbackView from '@/views/CallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: authMiddleware
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: authMiddleware
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostView
    },
    {
      path: '/createpost',
      name: 'createpost',
      component: CreatePost,
      beforeEnter: authMiddleware
    },
    {
      path: '/editpost/:id',
      name: 'editpost',
      component: EditPost,
      beforeEnter: authMiddleware
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: adminMiddleware,
      children: [
        {
          path: 'categorias',
          name: 'admin-categorias',
          component: AdminCatView
        },
        {
          path: 'categorias/:id',
          name: 'admin-categoria',
          component: AdminCatDetView
        },
        {
          path: 'editcategorie/:id',
          name: 'admin-editcategorie',
          component: AdminCatEdView
        }
      ]
    },
    { path: '/404', component: PageNotFound },
    { path: '/403', component: PageForbidden },
    { path: '/:catchAll(.*)', redirect: '/404' }
  ]
})

export default router
