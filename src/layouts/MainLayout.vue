<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleSideMenu"
        />

        
      <q-toolbar-title>
        <q-btn 
          flat
          size="18px" 
          label="Dashboard de Pruebas" 
          to="/" 
          class="q-px-none" 
        />
      </q-toolbar-title>
        
        <q-btn
          flat 
          icon="las la-door-open"
          label="Ingresar"
          @click="goToLogin"
        />

        <q-btn
          flat
          dense
          round
          icon="las la-user-circle"
          aria-label="Profile"
        >
        <q-menu 
          transition-show="scale"
          transition-hide="scale"
        >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Opciones</div>
            <q-btn
              size="12px"
              label="Perfil"
              color="secondary"
              push
              dense
              @click="goToProfile"
            />
            <br>
            <q-btn
              size="12px"
              label="Notifications"
              color="secondary"
              push
              dense
              @click="goToNotifications"
            />
            <br>
            <q-btn
              size="12px"
              label="Configuración"
              color="secondary"
              push
              dense
              class="q-pa-xs"
              @click="goToConfigurations"
            />
          </div>

          <q-separator vertical inset class="q-mx-md"/>

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="/public/imgs/GitHub.jpg">
            </q-avatar>

            <div class="flex items-center q-mt-lg">
              <span class="text-subtitle2 text-center">Edwin Lopez</span>
            </div>

            <div class="flex itmes-center q-mt-sm">
              <q-btn
              class="q-mt-md"
              color="primary"
              label="Logout"
              push
              size="sm"
              @click="goToLogin"
              v-close-popup
            />
            </div>
          </div>
        </div>
      </q-menu>
      </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="sideMenuOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
        Aplicaciones
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
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
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { linksList } from '../router/link-list'
//import { getsideMenuOpen } from 'src/store/UI/getters';
const mobileData = ref(true)
const bluetooth = ref(false)

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

const {sideMenuOpen, toggleSideMenu} = useUI()


function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const router = useRouter()

const goToProfile = () => {
  router.push({ name: 'profile' }) 
}

const goToHome = () => {
  router.push({ name: '/' }) 
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

</script>
