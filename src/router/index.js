import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'index', component: () => import(/* webpackChunkName: "index" */ '../components/index.vue') },
  
  { path: '/pricing', name: 'pricing', component: () => import(/* webpackChunkName: "pricing" */ '../components/pricing.vue'), meta: { requiresVisitor: true }, },
  { path: '/register', name: 'register', component: () => import(/* webpackChunkName: "register" */ '../components/auth/register.vue'), meta: { requiresVisitor: true }, },

  { path: '/login', name: 'login', component: () => import(/* webpackChunkName: "login" */ '../components/auth/login.vue'), meta: { requiresVisitor: true }, },
  { path: '/settings', name: 'settings', component: () => import(/* webpackChunkName: "settings" */ '../components/auth/settings.vue'), meta: { requiresAuth: true }, },
  { path: '/subscriptions', name: 'subscriptions', component: () => import(/* webpackChunkName: "subscriptions" */ '../components/auth/subscriptions.vue'), meta: { requiresAuth: true }, },
  { path: '/stats', name: 'stats', component: () => import(/* webpackChunkName: "stats" */ '../components/stats/index.vue'), meta: { requiresAuth: true }, },

  { path: '/users', name: 'users', component: () => import(/* webpackChunkName: "users" */ '../components/users/index.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },
  { path: '/users/new', name: 'user-new', component: () => import(/* webpackChunkName: "user-new" */ '../components/users/new.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },
  { path: '/users/:id', name: 'user-preview', component: () => import('../components/users/preview.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },

  { path: '/tasks', name: 'tasks', component: () => import(/* webpackChunkName: "tasks" */ '../components/tasks/index.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },
  { path: '/tasks/new', name: 'task-new', component: () => import(/* webpackChunkName: "task-new" */ '../components/tasks/new.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },
  { path: '/tasks/:id', name: 'task-preview', component: () => import('../components/tasks/preview.vue'), meta: { requiresAuth: true, requiresSubscription: true, }, },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let loggedIn = new Vue().isLoggedIn()
  let userInfo = new Vue().getUserInfo()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (loggedIn) {
      next({
        name: 'users',
      })
    } else {
      next()
    }
  } else {
    next()
  }
  
  if (to.matched.some(record => record.meta.requiresSubscription)) {
    if (userInfo.stripe_id == null) {
      next({
        name: 'subscriptions',
      })
    } else {
      next()
    }
  }
})

export default router
