<template>
  <q-card flat="true" bordered style="width: 400px; max-width: 80vw;">
    <q-card-section>
      <q-form @submit="HandleSupport" ref="supportForm">
        <div class="text-h6 text-center">Support</div>

        <q-separator class="q-mb-lg"></q-separator>

        <div class="flex row justify-evenly">
          <div class="col">
            <q-input v-model="developSupport.asunto" label="Agregar un asunto" dense
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:append>
                <q-icon name="las la-envelope" color="dark" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="flex row justify-evenly">
          <div class="col q-mb-lg">
            <q-input v-model="developSupport.comments" square type="textarea" hint="Especifica el problema" rows="2"
              label="Comentarios" :rules="[val => val && val.length > 0 || 'Este campo es requerido']" />
          </div>
        </div>
        <!-- <div class="flex row justify-center">
          <div class="row">
            <q-uploader style="max-width: 500px" max-files="3" label="Capturas del problema" multiple
              accept=".jpg, image/*" @rejected="onRejected" />
          </div>
        </div> -->
        <q-separator class="q-mt-lg" />
        <q-card-actions class="flex justify-end">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />

          <q-btn label="Enviar" color="primary" :loading="loading[0]" type="submit" push
            icon-right="las la-paper-plane" />


        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const loading = ref([false])
const supportForm = ref(null)
const $q = useQuasar()
const emit = defineEmits(['close-dialog-pass'])

const developSupport = ref({
  asunto: '',
  comments: ''
})

function onRejected(rejectedEntries) {
  // Notify plugin needs to be installed
  // https://v2.quasar.dev/quasar-plugins/notify#Installation
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

async function HandleSupport() {

  if (supportForm.value && supportForm.value.validate()) {

    console.log('Validation passed');
    console.log(developSupport.value.asunto);
    console.log(developSupport.value.comments);


    confirm()

  } else {
    // Si el formulario no es válido, mostrar un mensaje
    $q.notify({
      color: 'negative',
      message: 'Por favor, completa todos los campos requeridos.',
      icon: 'warning'
    })
  }
}

// Alerta de confirmacion
function confirm() {

  $q.dialog({
    transitionShow: 'fade',
    dark: false,
    title: 'Confirm',
    message: 'Valida los datos primero, Estas seguro(a)?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    console.log('Entrando a la funcion simulateProgress')
    simulateProgress(0)
  }).onCancel(() => {
    console.log('El usuario canceló.')
  })

}

function simulateProgress(number) {
  // Activamos el estado de carga
  loading.value[number] = true;

  const userProfile = ref(JSON.parse(localStorage.getItem('userLogin')))

  const email = userProfile.value.email;
  const userId = userProfile.value.id;
  console.log(email);
  console.log(userId);

  // Crear un objeto FormData y agregar todos los campos del formulario
  const formData = new FormData()

  formData.append('asunto', developSupport.value.asunto)
  formData.append('comments', developSupport.value.comments)
  formData.append('email', email)
  formData.append('idUser', userId)

  api.post('/email/support', formData, {

    headers: {
      'Content-Type': 'multipart/form-data', // Importante para indicar que estamos enviando datos de formulario con archivos
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    }

  }).then(response => {

    console.log(response.data);
    loading.value[number] = false

    $q.notify({
      color: 'positive',
      message: 'Correo enviado con éxito',
      icon: 'check'
    })
    close()
  }).catch(error => {

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
        message: 'Hubo un error al enviar el correo',
        icon: 'error',
      });
      console.error('Error al enviar correo:', error);

      loading.value[number] = false;
    }
  })
}

function close() {
  emit('close-dialog-pass');
}

defineOptions({
  name: 'SupportPage'
})
</script>
