import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import home from '@/components/Home'
import welcome from '@/components/welcome'
Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/login', component: login },
    { path: '/home', component: home, redirect: '/welcome',children:[{path: '/welcome', component: welcome}]}
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
