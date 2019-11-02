import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Index from '../components/index.vue'
import Roles from '../components/rights/roles.vue'
import Rights from '../components/rights/rights.vue'
import ElementUI from 'element-ui'
import Users from '../components/users/users.vue'
import 'element-ui/lib/theme-chalk/index.css'

// 使用element-ui
Vue.use(ElementUI)

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  {
    path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }

    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫开始
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
