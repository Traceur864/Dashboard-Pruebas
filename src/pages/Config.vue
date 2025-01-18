<template>
  <q-page class="flex justify-center q-pa-xl">

    <q-dialog v-model="change" transition-show="fade" transition-hide="fade" transition-duration="300">
      <ChangePassword @close-dialog-pass="closeDialog" @reload="reload" />
    </q-dialog>

    <q-dialog v-model="support" transition-show="fade" transition-hide="fade" transition-duration="300">
      <DevelopmentSupport @close-dialog-pass="closeDialogSupport" @reload="reload" />
    </q-dialog>

    <q-card flat="true" bordered class="q-pa-none bg-dark" style="width: 100%; max-width: 600px; height: 100%">
      <q-card-section class="bg-grey-2">
        <q-list bordered>
          <q-item clickable v-ripple class="q-my-sm" @click="openChangePass">
            <q-item-section avatar>
              <q-avatar rounded text-color="black" icon="las la-key" />
            </q-item-section>
            <q-item-section>Change password</q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>General</q-item-label>

          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check1" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Notifications</q-item-label>
              <q-item-label caption>
                Notify me about updates to apps or games that I downloaded
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md" spaced />

          <q-item clickable v-ripple class="q-my-sm" to="/profile">
            <q-item-section avatar>
              <q-avatar v-if="!userProfile.picture == '' || !userProfile.picture == null">
                <img :src="'http://localhost:3000/uploads/' + userProfile.picture" />
              </q-avatar>
              <q-avatar v-else>
                <img src="../../public/imgs/NoIMgae.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="q-my-sm" @click="openSupport">
            <q-item-section avatar>
              <q-avatar rounded text-color="black" icon="las la-envelope" />
            </q-item-section>
            <q-item-section>Contact</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple class="q-my-sm" @click="closeLogin">
            <q-item-section avatar>
              <q-avatar rounded text-color="black" icon="las la-lock" />
            </q-item-section>
            <q-item-section>Close Session</q-item-section>
          </q-item>


          <q-separator />
        </q-list>
      </q-card-section>
    </q-card>



  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChangePassword from '../pages/Profile/ChangePassword.vue'
import DevelopmentSupport from './Profile/DevelopmentSupport.vue'

const isLoggedIn = ref(localStorage.getItem('authToken') !== null)
const userProfile = ref(JSON.parse(localStorage.getItem('userLogin')))
const check1 = ref(false)
const change = ref(false)
const support = ref(false)
const router = useRouter()

const openChangePass = () => {
  change.value = true
}

const openSupport = () => {
  support.value = true
}

const closeLogin = () => {

  localStorage.removeItem('authToken')  // Eliminar el token
  localStorage.removeItem('userLogin')  // Eliminar los datos del usuario

  isLoggedIn.value = false  // Cambiar el estado de login

  router.push({ name: 'login' }).then(() => {
    location.reload()
  }) // Redirigir al login

}

const closeDialog = () => {
  change.value = false
}

const closeDialogSupport = () => {
  support.value = false
}

defineOptions({
  name: 'ConfigPages'
})

</script>
