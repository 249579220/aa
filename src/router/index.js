import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import home from '@/components/Home'
Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/login', component: login },
    { path: '/home', component: home }
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
