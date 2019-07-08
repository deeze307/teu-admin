import Vue from 'vue'
import Router from 'vue-router'

// Paginas
import login from '@/pages/login'
import home from '@/pages/home'
import empleos from '@/pages/admin/home-empleos'
import contacto from '@/pages/contacto'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/empleos',
      name: 'empleos',
      component: empleos
    }
  ]
})
