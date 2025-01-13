<template>

  <q-card style="width: 500px; max-width: 80vw;">

    <q-card-section>
      <span class="text-h5 text-weight-regular"
        style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Acceso a Dashborad</span>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="handleRegister" ref="registerForm">
        <q-select v-model="selectedArea" label="Area" :options="areas" outlined dense class="q-mb-md"
          @update:model-value="fetchUsersByArea" />
        <q-select v-model="userFormRegister.name" label="Usuario" :options="filteredUsers" outlined dense
          class="q-mb-md" @update:model-value="onUserSelect" />
        <q-select v-model="userFormRegister.rol" label="Roles" :options="optionsRol"
          :rules="[val => val && val.length > 0 || 'Este campo es requerido']" outlined dense>
        </q-select>
        <q-input v-model="userFormRegister.email" label="Correo" type="email" suffix="@fii-na.com" outlined dense
          class="q-mb-md" :rules="[val => val && val.length > 0 || 'Este campo es requerido']" />
        <q-input v-model="userFormRegister.password" label="Contraseña" :type="isPwd ? 'password' : 'text'" :rules="[
          val => val && val.length > 0 || 'Este campo es requerido',
          val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
          val => val.length <= 12 || 'La contraseña debe tener un maximo de 12 caracteres',
        ]" outlined dense counter>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>

        <q-separator class="q-mt-sm" />

        <div class="flex justify-end q-mt-md">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Registrar" color="primary" type="submit" :loading="loading[0]" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>

</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
const emit = defineEmits(['close-dialog-Access']);

const router = useRouter()
const $q = useQuasar()
const filteredUsers = ref([])
const selectedArea = ref(null)

const userFormRegister = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  rol: ''
})

const areas = [
  'ICT',
  'MDA',
  'ISP',
  'BSI',
  'Programming',
  'Software Development'
]

const loading = ref([false])
const registerForm = ref(null)
const isPwd = ref(true)


const optionsRol = [
  'Administrador',
  'Full Programming',
  'Full ICT',
  'Full MDA',
  'Full ISP',
  'Full BSI',
  'Jr Programming',
  'Jr ICT',
  'Jr MDA',
  'Jr ISP',
  'Jr BSI'
]

const onUserSelect = (selectedUser) => {
  if (selectedUser) {
    // Aquí seleccionamos el ID y el nombre del usuario seleccionado
    userFormRegister.value.id = selectedUser.value;  // El value es el ID del usuario
    console.log(userFormRegister.value.id);

    userFormRegister.value.name = selectedUser.label; // El label es el nombre completo
    console.log(userFormRegister.value.name);

  } else {
    // Si no se selecciona ningún usuario, limpiamos los valores
    userFormRegister.value.id = '';
    userFormRegister.value.name = '';
  }
};


function handleRegister() {
  // Validar si el formulario es válido antes de iniciar el proceso de carga
  if (registerForm.value && registerForm.value.validate()) {
    // Si es válido, activar el loading
    console.log(registerForm.value)

    simulateProgress(0);
  }
}

async function simulateProgress(number) {
  // Activamos el estado de carga
  loading.value[number] = true;

  const userId = userFormRegister.value.id;
  console.log('id del usuario:' + userId);

  if (!userId) {
    $q.notify({
      color: 'negative',
      message: 'ID de usuario no encontrado.',
      icon: 'error'
    });
    return;
  }

  console.log([
    userFormRegister.value.id,
    userFormRegister.value.name,
    userFormRegister.value.email,
    userFormRegister.value.password,
    userFormRegister.value.rol
  ]);

  try {
    const formData = new FormData()

    formData.append('id', userFormRegister.value.id)
    formData.append('email', userFormRegister.value.email)
    formData.append('password', userFormRegister.value.password)
    formData.append('rol', userFormRegister.value.rol)

    const response = await api.put(`auth/register/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status === 200) {
      // Si la actualización fue exitosa

      $q.notify({
        color: 'positive',
        message: 'Accesso correctamente.',
        icon: 'check',
      });
      emit('reloadUsers')
      // Aquí puedes emitir un evento de cierre o redirigir a otro lugar si es necesario
      cancel()
    }

  } catch (error) {
    // Si ocurrió un error

    if (error.response && error.response.data) {
      // Mostrar el mensaje de error del servidor
      $q.notify({
        color: 'negative',
        message: error.response.data.msg || 'Error desconocido',
        icon: 'warning',
      });
      loading.value[number] = false;
    } else {
      // En caso de que no haya respuesta, mostrar un mensaje genérico
      $q.notify({
        color: 'negative',
        message: 'Hubo un error al otorgar acceso el usuario.',
        icon: 'error',
      });
      console.error('Error al actualizar el usuario:', error);

      loading.value[number] = false;
    }
  }
}

function cancel() {
  // Aquí emitimos el evento 'close-dialog' al componente padre
  emit('close-dialog-Access')
}

onMounted(() => {
  fetchUsersByArea(selectedArea.value); // Si ya tienes un área seleccionada al montar, puedes cargar los usuarios.
});

// Función para obtener usuarios según el área seleccionada
const fetchUsersByArea = async (area) => {
  if (area) {
    try {
      const response = await api.get(`/api/testusers/${area}`);
      filteredUsers.value = response.data.map(user => ({
        label: user.NAME + " " + user.LASTNAME, value: user.ID_USER
      }));
      clear()
      console.log(filteredUsers.value);

    } catch (error) {
      console.error('Error fetching users:', error);
      $q.notify({
        color: 'warning',
        message: 'No se pudieron cargar los usuarios de esta área.',
        icon: 'warning',
      });
      clear()
    }
  } else {
    filteredUsers.value = [];
  }
};

function clear() {
  userFormRegister.value.name = ''
}

defineOptions({
  name: 'RegisterPage'
});

</script>
