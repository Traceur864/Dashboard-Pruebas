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
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Dashboard de Pruebas
        </q-toolbar-title>

        <q-btn 
          flat
          push 
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
          @click="goToProfile"
        />

        <q-btn
          flat
          dense
          round
          icon="las la-bell"
          aria-label="Notifications"
          @click="goToNotifications"
        />

        <q-btn
          flat
          dense
          round
          icon="las la-cog"
          aria-label="Configuration"
          @click="goToConfigurations"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
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
//import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { linksList } from '../router/link-list'
//import { getsideMenuOpen } from 'src/store/UI/getters';

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)
const store = useStore()

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

/* getsideMenuOpen: computed( () => store.getters['ui/isSideMenuOpen'])
 */
/* function toggleSideMenu() {
  store.commit('ui/toggleSideMenu')
} */


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

</script>
