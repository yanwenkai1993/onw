import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Roles from '@/components/roles/Roles'
import Righys from '@/components/rights/Rights'
import Goods from '@/components/goods/Goods'
import GoodsAdd from '@/components/goods-add/GoodsAdd'
Vue.use(Router)

// 创建路由实列
const router = new Router({
  routes: [{
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/home',
    component: Home,
    name: 'home',
    // 在父路由中，添加子路由
    children: [{
      path: '/users',
      component: Users
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/rights',
      component: Righys
    }, {
      path: '/goods/:page?',
      component: Goods
    }, {
      path: '/goods-add',
      component: GoodsAdd
    }]
  }
  ]
})

// 使用导航守卫，判断是否登录过
router.beforeEach((to, feom, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取登录的状态码，判断是否登录过
  const token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
