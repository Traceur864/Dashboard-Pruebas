<template>
  <q-page class="q-pa-md">

    <div class="flex row q-pa-md justify-between">
      <div class="col-lg-2 col-md-4 col-sm-6 col-xs-8 flex justify-between">
        <q-btn push label="Registrar" color="blue-grey-8" @click="openDialog" />
        <q-btn push label="Crear acceso" color="green-9" @click="openDialogAccess" />
      </div>

      <q-btn push flat label="Historial de Usuarios" color="black" @click="openHistorial" />
    </div>

    <q-dialog v-model="fixed" transition-show="fade" transition-hide="fade" transition-duration="300">
      <RegisterUser @close-dialog="closeDialog" @reloadUsers="reloadUsers" />
    </q-dialog>

    <q-dialog v-model="access" transition-show="fade" transition-hide="fade" transition-duration="300">
      <RegisterLogin @close-dialog-Access="closeDialogAccess" @reloadUsers="reloadUsers" />
    </q-dialog>

    <TeamWork :reload="reload" />

    <!-- <Flex /> -->

  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import RegisterUser from '../../components/Dialogs/OrganigramaDialogs/RegisterUser.vue'
import TeamWork from '../../components/Dialogs/OrganigramaDialogs/TeamWork.vue'
import RegisterLogin from '../../pages/Profile/Register.vue'

const fixed = ref(false)
const access = ref(false)
const reload = ref(false)

const router = useRouter()

function openDialog() {
  fixed.value = true;
}
function closeDialog() {
  fixed.value = false;
}

function openDialogAccess() {
  access.value = true;
}
function closeDialogAccess() {
  access.value = false;
}

function openHistorial() {
  router.push({ name: 'historial_usuarios' })
}

function reloadUsers() {
  reload.value = !reload.value;
}
defineOptions({
  name: 'OrganigramaPage'
});
</script>
