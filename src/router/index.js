import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/nodedetail',
    name: 'nodedetail',
    component: () => import('../views/nodedetail/index.vue')
  },
  {
    path: '/mynode',
    name: 'mynode',
    component: () => import('../views/mynode/index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/mynode/nodes.vue')
      },
      {
        name: 'register',
        path: 'register',
        component: () => import('../views/mynode/register.vue')
      },
      {
        name: 'mynodedetail',
        path: 'detail',
        component: () => import('../views/mynodedetail/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
