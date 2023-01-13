import Vue from 'vue'
import VueRouter from 'vue-router'
import AddValueView from '../views/AddValueView.vue'
import ShortReportView from '../views/ShortReportView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'addValue',
    component: AddValueView
  },
  {
    path: '/shortReport',
    name: 'shortReport',
    component: ShortReportView
  },
  {
    path: '/:catchAll(.*)*',
    name: "PageNotFound",
    component: PageNotFoundView,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
