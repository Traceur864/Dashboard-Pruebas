<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="las la-bars" aria-label="Menu" @click="toggleSideMenu" />

        <q-toolbar-title>

          <q-img src="/public/imgs/Ingrasys.png" alt="Ingrasys" :style="{ width: '115px' }" class="q-mr-sm" />

          <q-btn flat size="18px" label="Dashboard de Pruebas" to="/" />

        </q-toolbar-title>

        <q-btn flat v-if="!isLoggedIn" icon="las la-door-open" label="Ingresar" @click="goToLogin" />

        <div v-if="isLoggedIn" class="flex justify-end text-weight-medium q-mx-xs">Bienvenido(a) <span
            class="q-ml-sm">{{ userLogin.name
            }}</span></div>

        <q-btn flat dense round icon="las la-user-circle" aria-label="Profile" v-if="isLoggedIn">

          <q-menu transition-show="scale" transition-hide="scale">
            <div class="flex row no-wrap q-pa-md">
              <div class="flex column justify-between">
                <div class="flex justify-center text-h6">Opciones</div>
                <q-btn size="sm" label="Perfil" color="secondary" push @click="goToProfile" />

                <q-btn size="sm" label="Notifications" color="secondary" push @click="goToNotifications"
                  class="display: hidden" />

                <!--                 <q-btn size="sm" label="Configuración" color="secondary" push @click="goToConfigurations" />
 --> <q-btn size="sm" label="Configuración" color="secondary" push @click="goToConfig" />
              </div>

              <q-separator vertical inset class="q-mx-sm" />

              <div class="flex column justify-between">
                <div class="flex justify-center" v-if="!userLogin.picture == ''">
                  <q-avatar size="66px">
                    <img :src="'http://localhost:3000/uploads/' + userLogin.picture">
                  </q-avatar>
                </div>
                <div class="flex justify-center" v-else>
                  <q-avatar size="66px">
                    <img src="../../public/imgs/NoIMgae.png" />
                  </q-avatar>
                </div>
                <div class="flex justify-center">
                  <span class="text-weight-small text-subtitle2 q-mr-xs">{{ userLogin.name }}</span>
                  <span class="text-weight-small text-subtitle2">{{ userLogin.lastname }}</span>
                </div>


                <div class="flex justify-center">
                  <q-btn class="q-mt-md" color="primary" label="Logout" push size="sm" @click="logout" v-close-popup />
                </div>

              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="sideMenuOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Aplicaciones
        </q-item-label>

        <EssentialLink v-for="link in filteredLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import useUI from '../composables/useUI'
import { useRouter } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { linksList } from '../router/link-list'

const leftDrawerOpen = ref(false)
const isLoggedIn = ref(localStorage.getItem('authToken') !== null)
const { sideMenuOpen, toggleSideMenu } = useUI()
const userLogin = ref(JSON.parse(localStorage.getItem('userLogin')))
const userRoles = computed(() => userLogin.value ? userLogin.value.rol : [])

// Función para cerrar sesión
const logout = () => {

  localStorage.removeItem('authToken')  // Eliminar el token
  localStorage.removeItem('userLogin')  // Eliminar los datos del usuario

  isLoggedIn.value = false  // Cambiar el estado de login

  router.push({ name: 'login' }).then(() => {
    location.reload()
  }) // Redirigir al login

}

// Función para filtrar las opciones de menú según los roles del usuario
const filteredLinks = computed(() => {
  return linksList.filter(link => {
    // Verifica si la ruta tiene roles definidos en su meta
    if (link.meta && Array.isArray(link.meta.rol)) {
      return link.meta.rol.some(role => userRoles.value.includes(role));
    }
    return true // Si no tiene roles definidos, es accesible para todos
  })
})

// Reacciona a los cambios en el usuario para actualizar localStorage
watch(() => localStorage.getItem('userLogin'), (newVal) => {
  if (newVal) {
    userLogin.value = JSON.parse(newVal); // Actualizar el usuario logueado cuando cambie el localStorage
  }
});

onMounted(() => {
  // Verifica que los datos se estén obteniendo correctamente
  console.log(userLogin.value);
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const router = useRouter()

const goToProfile = () => {
  router.push({ name: 'profile' })
}

const goToNotifications = () => {
  router.push({ name: 'notifications' })
}

const goToConfigurations = () => {
  router.push({ name: 'configurations' })
}

const goToConfig = () => {
  router.push({ name: 'config' })
}

const goToLogin = () => {
  router.push({ name: 'login' })
}

defineOptions({
  name: 'MainLayout'
})

</script>
