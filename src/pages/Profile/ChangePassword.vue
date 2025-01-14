<template>
  <q-card flat="true" bordered style="width: 400px; max-width: 80vw;">
    <q-card-section>
      <q-form @submit="HandleConfirmPass" ref="passwordFormConfirm">
        <div class="row justify-between">

          <div class="col q-gutter-lg">
            <div class="text-h6 flex justify-center">Cambiar contraseña</div>
            <q-separator></q-separator>
            <q-input v-model="changeFormPassword.actualpassword" label="Contraseña Actual"
              :type="isPwd ? 'password' : 'text'" :rules="[
                val => val && val.length > 0 || 'Este campo es requerido',
                val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                val => val.length <= 12 || 'La contraseña debe tener un maximo de 12 caracteres',
              ]" outlined dense counter>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-input v-model="changeFormPassword.newpassword" label="Nueva Contraseña"
              :type="isPwd2 ? 'password' : 'text'" :rules="[
                val => val && val.length > 0 || 'Este campo es requerido',
                val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                val => val.length <= 12 || 'La contraseña debe tener un maximo de 12 caracteres',
              ]" outlined dense counter>
              <template v-slot:append>
                <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd2 = !isPwd2" />
              </template>
            </q-input>
            <q-input v-model="changeFormPassword.confirmpassword" label="Confirma Contraseña"
              :type="isPwd3 ? 'password' : 'text'" :rules="[
                val => val && val.length > 0 || 'Este campo es requerido',
                val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                val => val.length <= 12 || 'La contraseña debe tener un maximo de 12 caracteres',
              ]" outlined dense counter>
              <template v-slot:append>
                <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd3 = !isPwd3" />
              </template>
            </q-input>
          </div>
        </div>
        <q-separator class="q-mt-md" />

        <q-card-actions class="flex justify-end">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" :loading="loadingPass[0]" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { api } from 'boot/axios'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const loadingPass = ref([false])
const isPwd = ref(true)
const isPwd2 = ref(true)
const isPwd3 = ref(true)
const passwordFormConfirm = ref(null)
const $q = useQuasar()
const userLogin = ref(JSON.parse(localStorage.getItem('userLogin')))
const emit = defineEmits(['close-dialog-pass'])
const isLoggedIn = ref(localStorage.getItem('authToken') !== null)
const router = useRouter()

const changeFormPassword = ref({
  actualpassword: '',
  newpassword: '',
  confirmpassword: '',
})

function HandleConfirmPass() {

  if (passwordFormConfirm.value && passwordFormConfirm.value.validate()) {

    if (changeFormPassword.value.newpassword === changeFormPassword.value.confirmpassword) {
      console.log('Validation passed')
      confirm()
    } else {
      $q.notify({
        color: 'negative',
        message: 'La contraseña no coincide',
        icon: 'warning'
      })
    }

  } else {
    // Si el formulario no es válido, mostrar un mensaje
    $q.notify({
      color: 'negative',
      message: 'Por favor, completa todos los campos requeridos.',
      icon: 'warning'
    })
  }
}

function confirm() {

  $q.dialog({
    transitionShow: 'fade',
    dark: false,
    title: 'Confirmar',
    message: '¿Cambiar contraseña?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    simulateProgress(0)
    console.log('simulateProgress')
  }).onCancel(() => {
    console.log('The user cancelled')
  })

}

async function simulateProgress(number) {
  // Activamos el estado de carga
  loadingPass.value[number] = true;

  const userId = userLogin.value.id;

  if (!userId) {
    $q.notify({
      color: 'negative',
      message: 'ID de usuario no encontrado.',
      icon: 'error'
    });
    return;
  }

  try {

    const formData = new FormData();
    formData.append('currentPassword', changeFormPassword.value.actualpassword)
    formData.append('newPassword', changeFormPassword.value.newpassword)

    const response = await api.put(`auth/changepass/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status === 200) {
      $q.notify({
        color: 'positive',
        message: 'Contraseña cambiada exitosamente',
        icon: 'check',
      })
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
      loadingPass.value[number] = false;
    } else {
      // En caso de que no haya respuesta, mostrar un mensaje genérico
      $q.notify({
        color: 'negative',
        message: 'Hubo un error al cambiar la contraseña',
        icon: 'error',
      });
      console.error('Error al cambiar contraseña:', error);

      loadingPass.value[number] = false;
    }
  }
}

function cancel() {
  // Aquí emitimos el evento 'close-dialog-pass' al componente padre
  emit('close-dialog-pass');
}

defineOptions({
  name: 'ChangePassword'
})

</script>
