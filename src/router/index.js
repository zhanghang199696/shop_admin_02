import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Index from '../components/index.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 使用element-ui
Vue.use(ElementUI)

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  { path: '/index', component: Index }
]

const router = new VueRouter({
  routes
})
// 导航守卫开始
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  console.log(to)
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
