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
          <div class="col">
            <q-input v-model="developSupport.comments" square type="textarea" hint="Especifica el problema" rows="2"
              label="Comentarios" :rules="[val => val && val.length > 0 || 'Este campo es requerido']" />
          </div>
        </div>
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

const developSupport = ref({
  asunto: '',
  comments: ''
})

async function HandleSupport() {

  if (supportForm.value && supportForm.value.validate()) {

    console.log('Validation passed');
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
    // console.log('>>>> Cancel')
  })

}

function simulateProgress(number) {
  // Activamos el estado de carga
  loading.value[number] = true;

  // Crear un objeto FormData y agregar todos los campos del formulario
  const formData = new FormData()

  formData.append('asunto', developSupport.value.asunto)
  formData.append('comments', developSupport.value.comments)

  api.post('/?', formData, {

    headers: {
      'Content-Type': 'multipart/form-data' // Importante para indicar que estamos enviando datos de formulario con archivos
    }

  }).then(response => {

    console.log(response.data);
    loading.value[number] = false

    $q.notify({
      color: 'positive',
      message: 'Correo enviado con éxito',
      icon: 'check'
    })
    onReset()
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


defineOptions({
  name: 'SupportPage'
})
</script>
