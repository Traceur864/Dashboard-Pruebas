<template>
  <q-page class="q-pa-lg">

    <div class="q-pa-md">
      <q-btn 
        push
        label="Registrar" 
        color="primary" 
        @click="fixed = true" 
      />
    </div>

    <!-- Dialog -->
    <q-dialog v-model="fixed" transition-show="fade" transition-hide="fade" transition-duration="300">
      <q-card style="width: 700px; max-width: 80vw;" >
        <q-card-section>
          <div class="text-h6">Registro</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form ref="loginForm">
            <div class="row justify-center q-mb-md">
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="nombre"
                  label="Nombre(s)"
                  type="text"
                  color="grey-3"
                  label-color="secondary"
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
              <div class="col-md-5 offset-md-1">
                <q-input
                  dense
                  square filled
                  v-model="apellido"
                  label="Apellido(s)"
                  type="text"
                  color="grey-3"
                  label-color="secondary"
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
            <div class="row justify-center q-mb-md">
              <div class="col-md-5">
                <q-input
                  dense
                  square filled
                  v-model="email"
                  label="Correo electrónico"
                  color="grey-3"
                  type="email"
                  label-color="secondary"
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
              <div class="col-md-5 offset-md-1">
                <q-input
                  dense
                  square filled
                  v-model="phone"
                  label="Teléfono"
                  color="grey-3" 
                  type="number"
                  label-color="secondary"
                  :rules="[
                    val => val && val.length > 0 || 'Este campo es requerido',
                    val => val && val.length <=10 || 'Please use maximum 10 characters',
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
            <div class="row justify-center q-mb-md">
              <div class="col-md-5">
                <q-select 
                  dense
                  square filled
                  v-model="puesto"
                  label="Puesto"
                  color="grey-3" 
                  label-color="secondary"
                  :options="optionsJob"
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
              <div class="col-md-5 offset-md-1">
                <q-select
                  dense 
                  square filled
                  v-model="area"
                  label="Area"
                  color="grey-3" 
                  label-color="secondary" 
                  :options="optionsArea"
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
            <div class="row justify-center q-mb-md">
            <div class="col-md-5">
              <q-select 
                dense  
                square filled
                v-model="turno"
                label="Turno"
                color="grey-3" 
                label-color="secondary" 
                :options="optionsTurn"
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
            <div class="col-md-5 offset-md-1">
              <q-input
                dense
                square filled
                v-model="empleado"
                label="No. Empleado"
                color="grey-3" 
                type="number"
                label-color="secondary"
                counter maxlength="8"
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
            <div class="row justify-center q-mb-md">
            <div class="col-md-5">
              <q-input
                dense
                square filled
                v-model="birthday"
                label="Birthday"
                color="grey-3" 
                type="date"
                label-color="secondary"
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
            <div class="col-md-5 offset-md-1">
              
            </div>
            </div>
        
            <q-separator />

            <q-card-actions class="flex justify-end">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn 
              flat 
              label="Registrar" 
              color="primary" 
              :loading="loading[0]"
              type="submit"
              @click="confirm"
              />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

      <div class="flex row q-pa-sm ">
        <q-card class="my-card q-ma-sm" v-for="(item, index) in items" :key="index">

          <!-- Sección para la imagen -->
          <q-card-section class="q-pa-lg">
            <div class="flex items-center justify-center">
              <q-avatar size="100px" font-size="52px">
                <img :src="item.img" :alt="item.alt"/>
              </q-avatar>
            </div>
          </q-card-section>

          <!-- Sección para el texto -->
          <q-card-section class="text-center">
            <div class="text-weight-medium text-subtitle1">{{ item.name }}</div>
            <div class="text-weight-light text-subtitle2">{{ item.role }}</div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div class="q-gutter-md">
              <q-btn
              push
              square
              color="orange-6"
              glossy text-color="black"
              icon="las la-pencil-alt"
              aria-label="Editar"
              />
              <q-btn
                push
                square
                color="red-14"
                glossy text-color="black"
                icon="las la-trash-alt"
                aria-label="Borrar"
              />
              <q-btn
                push
                square
                color="light-blue-6"
                glossy text-color="black"
                icon="las la-info-circle"
                aria-label="Info"
              />
            </div>
          </q-card-section>

        </q-card>
      </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'


const nombre = ref('')
const apellido = ref('')
const email = ref('')
const phone = ref(false)
const puesto = ref('')
const area = ref('')
const turno = ref('')
const empleado = ref(false)
const birthday = ref(false)

const loading = ref([false]);
const loginForm = ref(null);

const $q = useQuasar()

function confirm () {

  if (loginForm.value && loginForm.value.validate()) {
    console.log('Validation passed');
    
    $q.dialog({
        dark: true,
        title: 'Confirm',
        message: 'Would you like to turn on the wifi?',
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
  }   else {
    // Si el formulario no es válido, mostrar un mensaje
    $q.notify({
      color: 'negative',
      message: 'Por favor, completa todos los campos requeridos.',
      icon: 'warning'
    })
  }   
}

function simulateProgress(number) {    
    // Activamos el estado de carga
  loading.value[number] = true;

  // Simulamos un retraso para simular un inicio de sesión
  setTimeout(() => {
  // Después de 3 segundos, desactivamos el estado de carga
  loading.value[number] = false;
  // Aquí puedes manejar lo que sucede después de intentar iniciar sesión, 
  // como redirigir a otra página o mostrar un mensaje de error
  $q.notify({
      color: 'positive',
      message: 'Registro completado con éxito.',
      icon: 'check'
    })
    fixed.value = false // Cerrar el diálogo
  }, 3000);
  
}

const fixed = ref(false)
  const items = [
    { img: '/public/imgs/GitHub.jpg', name: 'Noel Mexia', role: 'Test Manager Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Nike.png', name: 'Isela Vargas', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Insta.jpg', name: 'Fernando Gutiérrez', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/GitHub.jpg', name: 'Monica Lopez', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Abraham Flores', role: 'Test Engineer Senior', alt: 'Profile Image' },
    { img: '/public/imgs/Nike.png', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Insta.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/GitHub.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' }
  ]

  const optionsJob = [
    'Test Manager Engineer', 'Test Jr', 'Test Engineer', 'Test Engineer Senior'
  ]

  const optionsArea = [
    'ICT PG520', 'ICT Vulcan', 'MDA', 'ICP'
  ]

  const optionsTurn = [
    'Turno 1', 'Turno 2', 'Turno 3'
  ]

  

defineOptions({
    name: 'OrganigramaPage'
});
</script>