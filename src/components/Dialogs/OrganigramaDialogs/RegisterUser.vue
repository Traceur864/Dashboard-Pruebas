<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">Registro</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="HandleRegister" ref="loginForm">
        <div class="row justify-between q-mb-sm">
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.nombre" label="Nombre(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.apellido" label="Apellido(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.email" label="Correo electrónico" color="grey-3" type="email"
              label-color="secondary">
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.phone" label="Teléfono" color="grey-3" type="number"
              label-color="secondary" lazy-rules :rules="[
                val => val && val.length > 0 || 'Este campo es requerido',
                val => val && val.length <= 10 || 'Please use maximum 10 characters',
                val => val && val.length >= 10 || 'Please use minimum 10 characters',
                val => val && /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,14}$/.test(val) || 'Please use valid phone number'
              ]" counter maxlength="10">
              <template v-slot:prepend>
                <q-icon name="las la-mobile-alt" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-6 q-gutter-md">
            <q-select dense square filled v-model="userForm.puesto" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-select dense square filled v-model="userForm.area" label="Area" color="grey-3" label-color="secondary"
              :options="optionsArea" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-thumbtack" color="secondary" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-6 q-gutter-md">
            <q-select dense square filled v-model="userForm.turno" label="Turno" color="grey-3" label-color="secondary"
              :options="optionsTurn" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.empleado" label="No. Empleado" color="grey-3" type="number"
              label-color="secondary" counter maxlength="8" lazy-rules :rules="[

                val => val && val.length > 0 || 'Este campo es requerido',
                val => val && val.length <= 8 || 'Please use maximum 8 characters',
                val => val && /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,14}$/.test(val) || 'Please use valid phone number',

              ]">
              <template v-slot:prepend>
                <q-icon name="las la-id-card" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userForm.birthday" label="Birthday" color="grey-3" type="date"
              label-color="secondary" :mask="YYYY - MM - DD" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-birthday-cake" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-file dense square filled v-model="userForm.picture" label="Foto" color="grey-3" label-color="secondary"
              counter accept="image/*" @added="onImageSelected">
              <template v-slot:prepend>
                <q-icon name="lar la-image" color="secondary" />
              </template>
            </q-file>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md">

          </div>
          <div class="flex justify-center col-md-6 q-gutter-md">
            <q-avatar size="50px" font-size="52px" v-if="imageUrl">
              <img src="../../../../public/imgs/NoIMgae.png" v-if="!imageUrl" />
              <img :src="imageUrl" v-else />
            </q-avatar>
          </div>
        </div>

        <q-separator />

        <q-card-actions class="flex justify-end">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Registrar" color="primary" :loading="loading[0]" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>

import { ref, watch } from 'vue'

import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()
const loading = ref([false])
const loginForm = ref(null)
const $q = useQuasar()
const imageUrl = ref('')

// Arrays para la seleccion en el formulario
const optionsJob = [
  'Test Manager Engineer',
  'Test Engineer Senior',
  'Test Engineer Full',
  'Test Engineer Jr',
  'Test Technician'
]

const optionsArea = [
  'ICT',
  'MDA',
  'ISP',
  'BSI',
  'Programming',
  'Software Development'
]

const optionsTurn = [
  'Administrativo',
  'Turno 1',
  'Turno 2',
  'Turno 3'
]

const userForm = ref({

  nombre: '',
  apellido: '',
  email: '',
  phone: false,
  puesto: '',
  area: '',
  turno: '',
  empleado: false,
  birthday: false,
  picture: null,

})

// Limpia los campos en el formulario
function onReset() {

  userForm.value.nombre = ''
  userForm.value.apellido = ''
  userForm.value.email = ''
  userForm.value.phone = false
  userForm.value.puesto = ''
  userForm.value.area = ''
  userForm.value.turno = ''
  userForm.value.empleado = false
  userForm.value.birthday = false
  userForm.value.picture = null

}

// Valida que los campos esten completos conforme a las reglas del formulario
async function HandleRegister() {

  if (loginForm.value && loginForm.value.validate()) {

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

// Se obtiene los datos del formulario una vez confirmado para hacer la peticion mediante la api
function simulateProgress(number) {
  // Activamos el estado de carga
  loading.value[number] = true;

  // Crear un objeto FormData y agregar todos los campos del formulario
  const formData = new FormData()

  formData.append('name', userForm.value.nombre)
  formData.append('lastname', userForm.value.apellido)
  formData.append('email', userForm.value.email)
  formData.append('phone', userForm.value.phone)
  formData.append('workstation', userForm.value.puesto)
  formData.append('area', userForm.value.area)
  formData.append('turn', userForm.value.turno)
  formData.append('noemployee', userForm.value.empleado)
  formData.append('birthday', userForm.value.birthday)

  // Agregar el archivo de la imagen (si existe)
  if (userForm.value.picture) {
    formData.append('picture', userForm.value.picture)
  }

  console.log(userForm.value.picture);

  api.post('/api/testers', formData, {

    headers: {
      'Content-Type': 'multipart/form-data' // Importante para indicar que estamos enviando datos de formulario con archivos
    }

  }).then(response => {

    console.log(response.data);
    loading.value[number] = false

    emit('reloadUsers')

    $q.notify({
      color: 'positive',
      message: 'Registro completado con éxito.',
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
        message: 'Hubo un error al registrar el usuario.',
        icon: 'error',
      });
      console.error('Error al registrar el usuario:', error);

      loading.value[number] = false;
    }
  })
}

function onImageSelected(file) {
  // Update the image preview when a file is added
  imageUrl.value = URL.createObjectURL(file);
}

watch(() => userForm.value.picture, (file) => {
  // Actualiza la imagen previa cuando el usuario selecciona una nueva imagen
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Envia la imagen por default en caso de que no exista
    imageUrl.value = "../../../../public/imgs/NoIMgae.png";
  }
});

defineOptions({
  name: 'RegisterUser'
});
</script>
