import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/' ,redirect: '/home'
    },
    {
      path: '/home', component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    next()
  }else{
    //访问的不是登录页面，则需要判断用户是否有token，有则放行，没有跳转至登录页
    const token = localStorage.getItem('token')
    if(token){
      next()
    }else{
      next('/login')
    }
  }

})

export default router
