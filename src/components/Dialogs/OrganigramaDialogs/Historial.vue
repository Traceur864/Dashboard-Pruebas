<template>
  <q-page class="q-pa-md">

    <div class="flex row q-pa-md justify-between">
      <q-btn push label="Registrar" color="blue-grey-8" @click="openDialog" />
      <q-btn push flat label="Organigrama" color="black" @click="openDiagrama" />
    </div>

    <q-dialog v-model="registerUser" transition-show="fade" transition-hide="fade" transition-duration="300">
      <RegisterUser @close-dialog="closeDialog" @reloadUsers="reloadUsers" />
    </q-dialog>

    <q-dialog v-model="editAllUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
      <EditUser :UserTestEdit="selectedAllUserEdit" @close-dialog-edit="closeDialogEdit" @reloadEdit="fetchUsers" />
    </q-dialog>

    <q-dialog v-model="infoAllUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
      <InfoUser :UserTest="selectedAllUser" />
    </q-dialog>

    <div v-if="testerusersAll.length === 0" class="flex justify-center q-pa-md">
      <p>No hay usuarios disponibles.</p>
    </div>

    <div v-else class="q-pa-md">
      <div class="text-h5 q-px-xs q-mb-xs">
        Historial de Usuarios
      </div>
      <q-grid flat bordered title="Historial de Usuarios" :data="testerusersAll" :columns="columns" row-key="ID_USER"
        :columns_filter="true" binary-state-sort>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-avatar size="40px" font-size="22px" v-if="!props.row.PICTURE == ''">
                <img :src="'http://localhost:3000/uploads/' + props.row.PICTURE" :alt="props.row.NAME" />
              </q-avatar>
              <q-avatar size="40px" font-size="22px" v-else>
                <img src="../../../../public/imgs/NoIMgae.png" />
              </q-avatar>
            </q-td>
            <q-td>
              <div class="text-weight-regular text-subtitle2">{{ props.row.NAME }} {{ props.row.LASTNAME
                }}</div>
            </q-td>
            <q-td>
              <div v-if="props.row.EMAIL !== ''">{{ props.row.EMAIL }}</div>
              <div v-else>Correo no asignado</div>
            </q-td>
            <q-td>
              <div class="text-weight-regular text-subtitle2">{{ props.row.WORKSTATION }}</div>
            </q-td>
            <q-td>
              <div class="text-weight-regular text-subtitle2">{{ props.row.AREA }}</div>
            </q-td>
            <q-td>
              <div class="text-weight-regular text-subtitle2">{{ props.row.TURN }}</div>
            </q-td>
            <q-td>
              <div v-if="props.row.STATUS === 'Activo'">
                <q-badge rounded color="primary">{{ props.row.STATUS }}</q-badge>
              </div>
              <div v-else>
                <q-badge rounded color="negative">{{ props.row.STATUS }}</q-badge>
              </div>
            </q-td>
            <q-td>
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
      </q-grid>
    </div>


  </q-page>
</template>
<script setup>
import RegisterUser from '../OrganigramaDialogs/RegisterUser.vue'
import EditUser from '../OrganigramaDialogs/EditUser.vue'
import InfoUser from '../OrganigramaDialogs/InfoUser.vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { ref, onMounted, watch } from 'vue'

const $q = useQuasar()
const testerusersAll = ref([])
const editAllUserTest = ref(false)
const infoAllUserTest = ref(false)

const selectedAllUser = ref(false)
const selectedAllUserEdit = ref(false)
const selectedUserDelete = ref(false)

const registerUser = ref(false)
const router = useRouter();

// Redirecciona o invoca algun componente
function openDialog() {
  registerUser.value = true;
}

const openDiagrama = () => {
  router.push('organigrama');
}

// Trae todos los usuarios registrador
const fetchUsers = async () => {
  try {

    const response = await api.get('/api/testusersall')
    testerusersAll.value = response.data // Almacenar los datos recibidos
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

const History = defineProps({
  reload: Boolean
})

onMounted(() => {
  fetchUsers()
})

// Usamos un watcher para reaccionar al cambio en la propiedad 'reload'
watch(() => History.reload, async () => {
  // Cuando 'reload' cambie, obtenemos la lista actualizada de usuarios
  try {
    fetchUsers()
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
});

function showUserDelete(UserAllTestDelete) {
  selectedUserDelete.value = UserAllTestDelete;  // Asignamos el usuario seleccionado para eliminación
  console.log(UserAllTestDelete);
  deletes() // Puedes verificar qué usuario estás pasando
}

function showUserInfo(UserAllTest) {
  selectedAllUser.value = UserAllTest  // Asignamos el usuario seleccionado
  infoAllUserTest.value = true  // Abrimos el diálogo
  console.log(UserAllTest);
}

function showUserEdit(UserAllTestEdit) {
  selectedAllUserEdit.value = UserAllTestEdit  // Asignamos el usuario seleccionado
  editAllUserTest.value = true  // Abrimos el dialogo editar
  console.log(UserAllTestEdit);
}

// Llama una funcion de la api para dar de baja un usuario
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

function closeDialogEdit() {
  editAllUserTest.value = false;
}

// Array donde se mustra los datos en los campos correspondientes
const columns = ref([
  { name: 'picture', field: 'PICTURE', required: true, label: 'Foto', align: 'left' },
  { name: 'name', field: 'NAME', required: true, label: 'Nombre', align: 'left', sortable: true },
  { name: 'email', field: 'EMAIL', required: true, label: 'Email', align: 'left', sortable: true },
  { name: 'workstation', field: 'WORKSTATION', required: true, label: 'Puesto de trabajo', align: 'left', sortable: true },
  { name: 'area', field: 'AREA', required: true, label: 'Area', align: 'left', sortable: true },
  { name: 'turn', field: 'TURN', required: true, label: 'Turno', align: 'left', sortable: true },
  { name: 'status', field: 'STATUS', required: true, label: 'Estatus', align: 'left', sortable: true },
  { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'left' }
])

defineOptions({
  name: 'HishorialPage'
})

</script>
