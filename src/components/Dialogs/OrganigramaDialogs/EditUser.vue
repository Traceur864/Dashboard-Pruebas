<template>
    <q-card style="width: 700px; max-width: 80vw;" >
        <q-card-section>
          <div class="text-h6">Editar</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit="HandleLoginEdit" ref="loginFormEdit" >
            <div class="row justify-between q-mb-md">
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="userFormEdit.nombre"
                  label="Nombre(s)"
                  type="text"
                  color="grey-3"
                  label-color="secondary"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-signature" 
                      color="secondary"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="userFormEdit.apellido"
                  label="Apellido(s)"
                  type="text"
                  color="grey-3"
                  label-color="secondary"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-signature" 
                      color="secondary"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row justify-between q-mb-md">
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="userFormEdit.email"
                  label="Correo electrónico"
                  color="grey-3"
                  type="email"
                  label-color="secondary"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-at" 
                      color="secondary"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="userFormEdit.phone"
                  label="Teléfono"
                  color="grey-3" 
                  type="number"
                  label-color="secondary"
                  lazy-rules
                  :rules="[
                    val => val && val.length > 0 || 'Este campo es requerido',
                    val => val && val.length <=10 || 'Please use maximum 10 characters',
                    val => val && val.length >=10 || 'Please use minimum 10 characters',
                    val => val && /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,14}$/.test(val) || 'Please use valid phone number'
                    ]"
                  counter 
                  maxlength="10"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-mobile-alt" 
                      color="secondary"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row justify-between q-mb-md">
              <div class="col-md-5">
                <q-select 
                  dense
                  square filled
                  v-model="userFormEdit.puesto"
                  label="Puesto"
                  color="grey-3" 
                  label-color="secondary"
                  :options="optionsJob"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-briefcase" 
                      color="secondary"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-md-5">
                <q-select
                  dense 
                  square filled
                  v-model="userFormEdit.area"
                  label="Area"
                  color="grey-3" 
                  label-color="secondary" 
                  :options="optionsArea"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-thumbtack" 
                      color="secondary"
                    />
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row justify-between q-mb-md">
            <div class="col-md-5">
              <q-select 
                dense  
                square filled
                v-model="userFormEdit.turno"
                label="Turno"
                color="grey-3" 
                label-color="secondary" 
                :options="optionsTurn"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                >
                <template v-slot:prepend>
                  <q-icon 
                    name="las la-user-clock" 
                    color="secondary"
                  />
                </template>
              </q-select>
            </div>
            <div class="col-md-5">
              <q-input
                dense
                square filled
                v-model="userFormEdit.empleado"
                label="No. Empleado"
                color="grey-3" 
                type="number"
                label-color="secondary"
                counter maxlength="8"
                lazy-rules
                :rules="[

                  val => val && val.length > 0 || 'Este campo es requerido', 
                  val => val && val.length <=8 || 'Please use maximum 8 characters',
                  val => val && /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,14}$/.test(val) || 'Please use valid phone number',

                ]"
                >
                <template v-slot:prepend>
                  <q-icon 
                    name="las la-id-card" 
                    color="secondary"
                  />
                </template>
              </q-input>
            </div>
            </div>
            <div class="row justify-between q-mb-md">
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="userFormEdit.birthday"
                  label="Birthday"
                  color="grey-3" 
                  type="date"
                  label-color="secondary"
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Este campo es requerido']"
                  >
                  <template v-slot:prepend>
                    <q-icon 
                      name="las la-birthday-cake" 
                      color="secondary"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-5">
                
              </div>
            </div>
        
            <q-separator />

            <q-card-actions class="flex justify-end">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn 
                flat 
                label="Guardar" 
                color="primary" 
                :loading="loadingEdit[0]"
                type="submit"
                />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
</template>

<script setup>

import { ref } from 'vue'
import { useQuasar } from 'quasar'

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()
const editUserTest = ref(false)
const loadingEdit = ref([false])
const loginFormEdit = ref(null)
const $q = useQuasar()

const userFormEdit = ref({

    nombre: '',
    apellido: '',
    email: '',
    phone: false,
    puesto: '',
    area: '',
    turno: '',
    empleado: false,
    birthday: false

})

function HandleLoginEdit (){

if (loginFormEdit.value && loginFormEdit.value.validate()) {

  console.log('Validation passed');
  confirm()

}else {
  // Si el formulario no es válido, mostrar un mensaje
  $q.notify({
    color: 'negative',
    message: 'Por favor, completa todos los campos requeridos.',
    icon: 'warning'
  })
}
}

function confirm () {

$q.dialog({
    transitionShow: 'fade',
    dark: false,
    title: 'Confirm',
    message: 'Validate data first, Are you sure?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    simulateProgress(0)
  }).onOk(() => {
    console.log('simulateProgress');
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    console.log('The user cancelled');
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    console.log('I am triggered on dismiss')
    // console.log('I am triggered on both OK and Cancel')
  })
   
}

function simulateProgress(number) {    
    // Activamos el estado de carga
    loadingEdit.value[number] = true;

  // Simulamos un retraso para simular un inicio de sesión
  setTimeout(() => {
  // Después de 3 segundos, desactivamos el estado de carga
  loadingEdit.value[number] = false;
  // Aquí puedes manejar lo que sucede después de intentar iniciar sesión, 
  // como redirigir a otra página o mostrar un mensaje de error
  $q.notify({
      color: 'positive',
      message: 'Registro modificado con éxito.',
      icon: 'check'
    })
    cancel() // Cerrar el diálogo
  }, 3000);
  
}

function cancel() {
  // Aquí emitimos el evento 'close-dialog' al componente padre
  emit('close-dialog-edit');
}

const optionsJob = [
    'Test Manager Engineer', 
    'Test Jr', 
    'Test Engineer', 
    'Test Engineer Senior'
  ]

  const optionsArea = [
    'ICT PG520', 
    'ICT Vulcan', 
    'MDA', 
    'ICP'
  ]

  const optionsTurn = [
    'Turno 1', 
    'Turno 2', 
    'Turno 3'
  ]

    defineOptions({
        name: 'EditUser'
    });
</script>