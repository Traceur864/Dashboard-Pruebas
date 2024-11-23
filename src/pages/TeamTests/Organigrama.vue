<template>
  <q-page class="q-pa-md">

    <div class="flex row justify-between q-pa-md">
      <div class="col-4">
      <q-btn 
        push
        glossy
        label="Registrar" 
        color="primary"
        @click="fixed = true" 
      />
    </div>
    <div class="col-4 flex justify-end">
      <q-btn 
        push
        glossy
        label="Descargar" 
        color="secondary"
      />
    </div>
    </div>
    

         <!-- Dialog -->
    <q-dialog v-model="fixed" transition-show="fade" transition-hide="fade" transition-duration="300">
      <RegisterUser />
    </q-dialog>

    <q-dialog v-model="editUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
      <EditUser />
    </q-dialog>

    <q-dialog v-model="infoUserTest" transition-show="fade" transition-hide="fade" transition-duration="300">
      <InfoUser />
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
                @click="editUserTest = true"
              />
              <q-btn
                push
                square
                color="red-14"
                glossy text-color="black"
                icon="las la-trash-alt"
                aria-label="Borrar"
                @click="deletes"
              />
              <q-btn
                push
                square
                color="light-blue-6"
                glossy text-color="black"
                icon="las la-info-circle"
                aria-label="Info"
                @click="infoUserTest = true"
              />
            </div>
          </q-card-section>

        </q-card>
      </div>
  </q-page>
</template>

<script setup>
import RegisterUser from '../../components/Dialogs/OrganigramaDialogs/RegisterUser.vue'
import EditUser from '../../components/Dialogs/OrganigramaDialogs/EditUser.vue'
import InfoUser from '../../components/Dialogs/OrganigramaDialogs/InfoUser.vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue'

const $q = useQuasar()
const fixed = ref(false)
const editUserTest = ref(false)
const infoUserTest = ref(false)


function deletes () {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure to erase this user?',
        cancel: true,
        transitionShow: 'fade',
        transitionHide: 'fade',
        persistent: true
      }).onOk(() => {
        console.log('User erase was successful');

        // console.log('>>>> OK')
      }).onOk(() => {

        $q.notify({
          color: 'positive',
          message: 'User erase was successful',
          icon: 'check'
        })
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {

        console.log('cancelled');
        
        // console.log('>>>> Cancel')
      }).onDismiss(() => {

        console.log('I am triggered on both OK and Cancel')
      })
    }
/* $q.notify({
color: 'negative',
message: 'Porfavor, contactar al equipo de desarrollo.',
icon: 'warning'
}) */


  const items = [
    { img: '/public/imgs/GitHub.jpg', name: 'Noel Mexia', role: 'Test Manager Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Nike.png', name: 'Isela Vargas', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Insta.jpg', name: 'Fernando Gutiérrez', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/GitHub.jpg', name: 'Monica Lopez', role: 'Test Engineer', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Abraham Flores', role: 'Test Engineer Senior', alt: 'Profile Image' },
    { img: '/public/imgs/Nike.png', name: 'Juan Ruvalcaba', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Insta.jpg', name: 'Montse Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/GitHub.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' },
    { img: '/public/imgs/Xbox.jpg', name: 'Edwin Lopez', role: 'Test Jr', alt: 'Profile Image' }
  ]

defineOptions({
    name: 'OrganigramaPage'
});
</script>