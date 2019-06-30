import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
// 导入权限列表组件
import Rights from '@/components/rights/Rights'
import Roles from '@/components/roles/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/' ,redirect: '/home'
    },
    {
      path: '/home', component: Home,
      children: [
        {path: 'users', component: Users},
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles },
      ]
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
