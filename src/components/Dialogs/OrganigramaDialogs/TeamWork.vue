<template>

  <!-- Dialog -->
  <q-dialog v-model="editUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
    <EditUser :UserTestEdit="selectedUserEdit" @close-dialog-edit="closeDialog" @reloadEdit="fetchUsers" />
  </q-dialog>

  <q-dialog v-model="infoUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
    <InfoUser :UserTest="selectedUser" />
  </q-dialog>


  <div class="flex row q-pa-sm ">
    <q-card class="my-card q-ma-sm" v-for="test in testerusers" :key="test.ID_USER">

      <!-- Sección para la imagen -->
      <q-card-section class="q-pa-lg">
        <div class="flex items-center justify-center">
          <q-avatar size="100px" font-size="52px" v-if="!test.PICTURE == null || !test.PICTURE == ''">
            <img :src="'http://localhost:3000/uploads/' + test.PICTURE" :alt="test.NAME" />
          </q-avatar>
          <q-avatar size="100px" font-size="52px" v-else>
            <img src="../../../../public/imgs/Nike.png" :alt="test.NAME" />
          </q-avatar>
        </div>
      </q-card-section>
      <!-- Sección para el texto -->
      <q-card-section class="text-center">
        <div class="text-weight-medium text-subtitle1">{{ test.NAME }} {{ test.LASTNAME }}</div>
        <div class="text-weight-light text-subtitle2">{{ test.WORKSTATION }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <div class="flex justify-between q-gutter-md">
          <q-btn push square color="orange-6" glossy text-color="black" icon="las la-pencil-alt" aria-label="Editar"
            @click="showUserEdit(test)" />
          <q-btn push square color="red-14" glossy text-color="black" icon="las la-trash-alt" aria-label="Borrar"
            @click="deletes" />
          <q-btn id="js" push square color="light-blue-6" glossy text-color="black" icon="las la-info-circle"
            aria-label="Info" @click="showUserInfo(test)" />
        </div>
      </q-card-section>

    </q-card>
  </div>

</template>
<script setup>
import axios from 'axios'
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'
import EditUser from '../OrganigramaDialogs/EditUser.vue'
import InfoUser from '../OrganigramaDialogs/InfoUser.vue'

const $q = useQuasar()
const testerusers = ref([]);
const editUserTest = ref(false)
const infoUserTest = ref(false)
const selectedUser = ref(false)
const selectedUserEdit = ref(false)

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/testusers') // Asegúrate de que esta URL sea correcta según tu backend
    testerusers.value = response.data // Almacenar los datos recibidos

    console.log(response.data);

  } catch (error) {

    console.error('Error fetching users:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los datos de los usuarios',
      icon: 'warning',
    });

  }
};

onMounted(() => {
  fetchUsers()
});

function showUserInfo(UserTest) {
  selectedUser.value = UserTest  // Asignamos el usuario seleccionado
  infoUserTest.value = true  // Abrimos el diálogo // Abrimos el dialogo editar
  console.log(UserTest);
}

function showUserEdit(UserTestEdit) {
  selectedUserEdit.value = UserTestEdit  // Asignamos el usuario seleccionado
  editUserTest.value = true  // Abrimos el diálogo // Abrimos el dialogo editar
  console.log(UserTestEdit);
}

function deletes() {
  $q.dialog({
    title: 'Confirmar',
    message: 'Dar de baja al usuario',
    cancel: true,
    transitionShow: 'fade',
    transitionHide: 'fade',
    persistent: true
  }).onOk(() => {
    console.log('User erase was successful');

    // console.log('>>>> OK')
  }).onOk(() => {

    $q.notify({
      color: 'positive',
      message: 'Peticion satisfactoria',
      icon: 'check'
    })
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {

    console.log('cancelled');

    // console.log('>>>> Cancel')
  }).onDismiss(() => {

    console.log('I am triggered on both OK and Cancel')
  })
}

function closeDialog() {
  editUserTest.value = false;
}

defineOptions({
  name: 'TeamWork'
});

</script>
<style lang="scss"></style>