import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Login = () => import('@/views/pages/Login')
const Forms = () => import('@/views/pages/Forms')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {requiresAuth: true},
          component: Dashboard
        },
        {
          path: 'forms',
          name: 'Forms',
          meta: {requiresAdmin: true},
          component: Forms
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      meta: { guest: true },
      component: Login
    },
  ]
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.state.auth.user.isAdmin) {
      next();
    } else {
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['auth/isAuthenticated']) {
      next();
    } else {
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters['auth/isAuthenticated']) {
      next("/dashboard");
    } else {
      next();
    }
  } else {
    next();
  } 
});

export default router;