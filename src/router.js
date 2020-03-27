import Vue from 'vue'
import Router from 'vue-router'
import AutoView from "@/views/AutoView";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'auto',
      component: AutoView,
      exact: true
    },
    {
      path: '/auto',
      name: 'auto',
      component: AutoView,
    },
    {
      path: '/manual',
      name: 'manual',
      component: () => import('./views/ManualView')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('./views/ConfigView')
    },
    {
      path: '/io',
      name: 'io',
      component: () => import('./views/IOView')
    }
  ]
})
