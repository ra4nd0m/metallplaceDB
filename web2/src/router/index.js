import Vue from 'vue'
import VueRouter from 'vue-router'
import AddValueView from '../views/AddValueView.vue'
import ShortReportView from '../views/ShortReportView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'
import LoginView from "../views/LoginView.vue";
import store from "@/store";
import LogoutView from "@/views/LogoutView.vue";

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
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView
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

// Add a navigation guard to the entire router
router.beforeEach((to, from, next) => {
  const token = store.getters.getToken;
  if (to.path !== "/login" && !token) {
    next("/login");
    return
  }
  next();
});

export default router
