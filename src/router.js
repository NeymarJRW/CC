import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/hot',
      name: 'hot',
      component: () => import('./views/Hot.vue')
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('./views/New.vue')
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('./views/My.vue')
    },
    {
      path: '/type',
      name: 'type',
      component: () => import('./views/Type.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('./views/Game.vue')
    },
    {
      path: '/fenlei',
      name: 'fenlei',
      component: () => import('./views/Fenlei.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('./views/Error.vue')
    },
  ]
})