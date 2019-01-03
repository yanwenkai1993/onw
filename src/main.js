// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// 导入elementui的css样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入自定义的css
import './assets/css/index.css'

import axios from 'axios'
// 在vue的原型上添加axios方法，每次使用就不用引入axios
Vue.prototype.$http = axios

// 配置基准路径不用每次发送请求都写一大堆
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 请求拦截器
// 每次发送请求都要添加token很烦，使用请求拦截器和响应请求器来自动获取
axios.interceptors.request.use(config => {
  // 统一添加请求头
  config.headers.Authorization = localStorage.getItem('token')
  // 一定要返回config
  return config
})
// 安装插件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
