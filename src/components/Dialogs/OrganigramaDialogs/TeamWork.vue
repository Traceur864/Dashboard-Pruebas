<template>

  <!-- Dialog -->
  <q-dialog v-model="editUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
    <EditUser :UserTestEdit="selectedUserEdit" @close-dialog-edit="closeDialog" @reloadEdit="fetchUsers" />
  </q-dialog>

  <q-dialog v-model="infoUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
    <InfoUser :UserTest="selectedUser" />
  </q-dialog>

  <div v-if="testerusers.length === 0" class="flex justify-center q-pa-md">
    <p>No hay usuarios disponibles.</p>
  </div>

  <div class="flex row q-pa-sm ">

    <q-card class="my-card q-ma-sm" v-for="test in testerusers" :key="test.ID_USER">

      <!-- Sección para la imagen -->
      <q-card-section class="q-pa-lg">
        <div class="flex items-center justify-center">
          <q-avatar size="100px" font-size="52px" v-if="!test.PICTURE == null || !test.PICTURE == ''">
            <img :src="'http://localhost:3000/uploads/' + test.PICTURE" :alt="test.NAME" />
          </q-avatar>
          <q-avatar size="100px" font-size="52px" v-else>
            <img src="../../../../public/imgs/NoIMgae.png" :alt="test.NAME" />
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
            @click="showUserDelete(test)" />
          <q-btn id="js" push square color="light-blue-6" glossy text-color="black" icon="las la-info-circle"
            aria-label="Info" @click="showUserInfo(test)" />
        </div>
      </q-card-section>

    </q-card>
  </div>

</template>

<script setup>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { ref, onMounted, watch } from 'vue'
import EditUser from '../OrganigramaDialogs/EditUser.vue'
import InfoUser from '../OrganigramaDialogs/InfoUser.vue'

const $q = useQuasar()
const testerusers = ref([])
const editUserTest = ref(false)
const infoUserTest = ref(false)

const selectedUser = ref(false)
const selectedUserEdit = ref(false)
const selectedUserDelete = ref(false)

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/testusers') // Asegúrate de que esta URL sea correcta según tu backend
    testerusers.value = response.data // Almacenar los datos recibidos

    console.log(response.data);

  } catch (error) {

    console.error('Error fetching users:', error)
    $q.notify({
      color: 'warning',
      message: 'No hay usuarios registrados',
      icon: 'warning',
    });

  }
};

const props = defineProps({
  reload: Boolean
})

onMounted(() => {
  fetchUsers()
})

// Usamos un watcher para reaccionar al cambio en la propiedad 'reload'
watch(() => props.reload, async () => {
  // Cuando 'reload' cambie, obtenemos la lista actualizada de usuarios
  try {
    fetchUsers()
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
});

function showUserDelete(UserTestDelete) {
  selectedUserDelete.value = UserTestDelete;  // Asignamos el usuario seleccionado para eliminación
  console.log(UserTestDelete);
  deletes() // Puedes verificar qué usuario estás pasando
}

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

  }).onOk(async () => {
    try {
      const userId = selectedUserDelete.value.ID_USER;

      console.log(userId);

      const response = await api.put(`/api/delete/testers/${userId}`);

      if (response.status === 200) {
        $q.notify({
          color: 'positive',
          message: 'Usuario dado de baja correctamente',
          icon: 'check'
        })

        fetchUsers()
      }

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      $q.notify({
        color: 'negative',
        message: 'Hubo un error al eliminar al usuario.',
        icon: 'warning',
      });
    }

  }).onCancel(() => {

    console.log('cancelled');

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