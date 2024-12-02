<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">Registro</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="HandleRegister" ref="loginForm">
        <div class="row justify-between q-mb-sm">
          <div class="col-md-5">
            <q-input dense square filled v-model="userForm.nombre" label="Nombre(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userForm.apellido" label="Apellido(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-5">
            <q-input dense square filled v-model="userForm.email" label="Correo electrónico" color="grey-3" type="email"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
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
          <div class="col-md-5">
            <q-select dense square filled v-model="userForm.puesto" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
            <q-select dense square filled v-model="userForm.area" label="Area" color="grey-3" label-color="secondary"
              :options="optionsArea" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-thumbtack" color="secondary" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row justify-between q-mb-sm">
          <div class="col-md-5">
            <q-select dense square filled v-model="userForm.turno" label="Turno" color="grey-3" label-color="secondary"
              :options="optionsTurn" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
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
          <div class="col-md-5">
            <q-input dense square filled v-model="userForm.birthday" label="Birthday" color="grey-3" type="date"
              label-color="secondary" :mask="YYYY - MM - DD" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-birthday-cake" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-file dense square filled v-model="userForm.picture" label="Foto" color="grey-3" label-color="secondary"
              counter accept="image/*" @change="handleFileUpload">
              <template v-slot:prepend>
                <q-icon name="lar la-image" color="secondary" />
              </template>
            </q-file>
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

import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios';
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()
const loading = ref([false]);
const loginForm = ref(null);
const $q = useQuasar()

const optionsJob = [
  'Test Manager Engineer',
  'Test Engineer Senior',
  'Test Engineer Jr',
  'Test Jr'
]

const optionsArea = [
  'ICT',
  'MDA',
  'ISP',
  'BSI'
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

function cancel() {
  // Aquí emitimos el evento 'close-dialog' al componente padre
  emit('close-dialog');
}

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

  axios.post('http://127.0.0.1:3000/api/testers', formData, {

    headers: {
      'Content-Type': 'multipart/form-data' // Importante para indicar que estamos enviando datos de formulario con archivos
    }

  }).then(response => {
    console.log(response.data);
    loading.value[number] = false
    emit('reloadRegister')
    $q.notify({
      color: 'positive',
      message: 'Registro completado con éxito.',
      icon: 'check'
    })
    cancel() // Cerrar el formulario

  }).catch(error => {

    loading.value[number] = false

    console.error(error)
    $q.notify({
      color: 'negative',
      message: 'Hubo un error al registrar al usuario.',
      icon: 'error'
    })
  })
}

// Función para manejar la carga de la imagen
function handleFileUpload(event) {
  userForm.value.picture = event.target.files[0] // Asignar el archivo a userForm
}

defineOptions({
  name: 'RegisterUser'
});
</script>