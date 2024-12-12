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

        <span v-if="isLoggedIn" class="flex justify-end text-weight-medium q-mx-md">Bienvenido(a) {{ userLogin.user
          }}</span>

        <q-btn flat dense round icon="las la-user-circle" aria-label="Profile" v-if="isLoggedIn">

          <q-menu transition-show="scale" transition-hide="scale">
            <div class="row no-wrap q-pa-md">
              <div class="flex column">
                <div class="flex justify-center text-h6">Opciones</div>
                <q-btn size="sm" label="Perfil" color="secondary" push @click="goToProfile" class="q-mt-xl" />

                <q-btn size="sm" label="Notifications" color="secondary" push @click="goToNotifications"
                  class="display: hidden" />

                <q-btn size="sm" label="Configuración" color="secondary" push class="q-pa-xs display: hidden"
                  @click="goToConfigurations" />
              </div>

              <q-separator vertical inset class="q-mx-md" />

              <div class="column items-center justify-between">
                <div class="q-mb-md" v-if="!userLogin.id_user == null">
                  <q-avatar size="66px" v-if="!userTest.picture == ''">
                    <img :src="'http://localhost:3000/uploads/' + userTest.picture">
                  </q-avatar>
                  <q-avatar size="66px">
                    <img src="../../public/imgs/NoIMgae.png" />
                  </q-avatar>
                </div>
                <div class="q-mb-md" v-else>
                  <q-avatar size="66px">
                    <img src="../../public/imgs/NoIMgae.png" />
                  </q-avatar>
                </div>
                <div class="flex column items-center" v-if="!userLogin.id_user == null">
                  <span class="text-subtitle2">{{ userTest.name }}</span>

                  <span class="text-subtitle2">{{ userTest.lastname }}</span>
                </div>
                <div class="flex column items-center" v-else>
                  <span class="text-subtitle2">{{ userLogin.user }}</span>

                  <span class="text-subtitle2">{{ userLogin.email }}</span>
                </div>

                <div>
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

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import useUI from '../composables/useUI'
import { useRouter } from 'vue-router';
import { ref, onMounted, reactive } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { linksList } from '../router/link-list'

const leftDrawerOpen = ref(false)
const isLoggedIn = ref(localStorage.getItem('authToken') !== null)
// Función para ir a la página de login
const { sideMenuOpen, toggleSideMenu } = useUI()

const userLogin = ref(JSON.parse(localStorage.getItem('userLogin')))
const userTest = ref(JSON.parse(localStorage.getItem('userTest')))

// Función para cerrar sesión
const logout = () => {

  localStorage.removeItem('authToken')  // Eliminar el token
  localStorage.removeItem('userLogin')  // Eliminar los datos del usuario
  localStorage.removeItem('userTest')   // Eliminar los datos adicionales

  isLoggedIn.value = false  // Cambiar el estado de login

  router.push({ name: 'login' })  // Redirigir al login
}

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

const goToLogin = () => {
  router.push({ name: 'login' })
}

defineOptions({
  name: 'MainLayout'
})

</script>
