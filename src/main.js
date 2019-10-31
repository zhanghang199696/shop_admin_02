import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// -----------axios的拦截器配置-------------------
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.meta.status === 401) {
    response.data.meta.msg = '尊敬的用户, 您的登陆状态已过期, 请重新登陆'
    // 再清除无效的token
    localStorage.removeItem('token')
    router.push('/login')
  }

  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
