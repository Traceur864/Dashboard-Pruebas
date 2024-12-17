import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useQuasar } from 'quasar'
const $q = useQuasar()

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('authToken') !== null;
    const userRoles = isLoggedIn ? JSON.parse(localStorage.getItem('userLogin')).rol : []

    // Verificar si la ruta requiere autenticación
    if (to.meta.requiresAuth && !isLoggedIn) {
      // Si no está autenticado, redirigir al login
      next({ name: 'login' });
    } else if (to.meta.rol && !to.meta.rol.some(role => userRoles.includes(role))) {
      // Si el usuario no tiene el rol adecuado, redirige a una página de acceso denegado o a la página de inicio
      next({ name: 'home' })

    } else {
      // Si está autenticado o la ruta no requiere autenticación, permite la navegación
      next();
    }
  });

  return Router
})