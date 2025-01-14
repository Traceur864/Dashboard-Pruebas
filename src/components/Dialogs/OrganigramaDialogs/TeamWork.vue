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

  <div class="q-pa-md">
    <q-table flat bordered title="Usuarios" :rows="testerusers" :columns="columns" row-key="ID_USER" binary-state-sort>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="picture" :props="props">
            <q-avatar size="40px" font-size="22px" v-if="props.row.PICTURE">
              <img :src="'http://localhost:3000/uploads/' + props.row.PICTURE" :alt="props.row.NAME" />
            </q-avatar>
            <q-avatar size="40px" font-size="22px" v-else>
              <img src="../../../../public/imgs/NoIMgae.png" :alt="props.row.NAME" />
            </q-avatar>
          </q-td>
          <q-td key="name" :props="props">
            <div class="text-weight-regular text-subtitle2">{{ props.row.NAME }} {{ props.row.LASTNAME }}</div>
          </q-td>
          <q-td key="email" :props="props">
            <div v-if="props.row.EMAIL !== ''">{{ props.row.EMAIL }}</div>
            <div v-else>Correo no asignado</div>
          </q-td>
          <q-td key="workstation" :props="props">
            <div class="text-weight-regular text-subtitle2">{{ props.row.WORKSTATION }}</div>
          </q-td>
          <q-td key="area" :props="props">
            <div class="text-weight-regular text-subtitle2">{{ props.row.AREA }}</div>
          </q-td>
          <q-td key="turn" :props="props">
            <div class="text-weight-regular text-subtitle2">{{ props.row.TURN }}</div>
          </q-td>
          <q-td key="acciones" :props="props">
            <div class="q-gutter-xs">
              <q-btn push color="orange-6" text-color="black" icon="las la-pencil-alt" aria-label="Editar"
                @click="showUserEdit(props.row)" />
              <q-btn push color="red-14" text-color="black" icon="las la-trash-alt" aria-label="Borrar"
                @click="showUserDelete(props.row)" />
              <q-btn id="js" push color="light-blue-6" text-color="black" icon="las la-info-circle" aria-label="Info"
                @click="showUserInfo(props.row)" />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
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

// Realiza una peticion a la api para obtener los datos de usuario
const fetchUsers = async () => {
  try {
    const response = await api.get('/api/testusers')
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

const Ut = defineProps({
  reload: Boolean
})

onMounted(() => {
  fetchUsers()
})
// Usamos un watcher para reaccionar al cambio en la propiedad 'reload'
watch(() => Ut.reload, async () => {
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
  infoUserTest.value = true  // Abrimos el diálogo
  console.log(UserTest);
}

function showUserEdit(UserTestEdit) {
  selectedUserEdit.value = UserTestEdit  // Asignamos el usuario seleccionado
  editUserTest.value = true // Abrimos el dialogo editar
  console.log(UserTestEdit);
}


// Hace la peticion a la api para dar de baja al usuario
function deletes() {
  $q.dialog({

    title: 'Confirmar',
    message: '¿Dar de baja al usuario?',
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

// Array para acomodar los datos en los campos correspondientes
const columns = ref([
  { name: 'picture', label: 'Foto', align: 'center', field: row => row.PICTURE, sortable: false },
  { name: 'name', label: 'Nombre', align: 'left', field: row => `${row.NAME} ${row.LASTNAME}`, sortable: true },
  { name: 'workstation', label: 'Puesto de trabajo', align: 'left', field: row => row.WORKSTATION, sortable: true },
  { name: 'area', label: 'Area', align: 'left', field: row => row.AREA, sortable: true },
  { name: 'turn', label: 'Turno', align: 'left', field: row => row.TURN, sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center', field: row => row.ID_USER, sortable: false }
]);

defineOptions({
  name: 'TeamWork'
});

</script>
<style lang="scss"></style>
