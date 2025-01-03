<template>
  <q-card flat bordered style="width: 50vw;">
    <q-card-section>
      <q-form @submit="HandleLoginEdit" ref="loginFormEdit">
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.nombre" label="Nombre(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.apellido" label="Apellido(s)" type="text"
              color="grey-3" label-color="secondary" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.email" label="Correo electrónico" color="grey-3"
              type="email" label-color="secondary">
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.phone" label="Teléfono" color="grey-3" type="number"
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
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-select dense square filled v-model="userFormProfile.puesto" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
            <q-select dense square filled v-model="userFormProfile.area" label="Area" color="grey-3"
              label-color="secondary" :options="optionsArea" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-thumbtack" color="secondary" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-select dense square filled v-model="userFormProfile.turno" label="Turno" color="grey-3"
              label-color="secondary" :options="optionsTurn" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.empleado" label="No. Empleado" color="grey-3"
              type="number" label-color="secondary" counter maxlength="8" lazy-rules :rules="[

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
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormProfile.birthday" label="Birthday" color="grey-3" type="date"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-birthday-cake" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-file dense square filled v-model="userFormProfile.picture" label="Foto" color="grey-3"
              label-color="secondary" counter accept="image/*" @added="onImageSelected">
              <template v-slot:prepend>
                <q-icon name="lar la-image" color="secondary" />
              </template>
            </q-file>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">

          </div>
          <div class="flex justify-center col-md-5">
            <q-avatar size="50px" font-size="52px">
              <!-- Show the selected image or the default image -->
              <img src="../../../public/imgs/NoIMgae.png" v-if="!imagePreviewUrl" />
              <img :src="imagePreviewUrl" v-else />
            </q-avatar>
          </div>
        </div>

        <q-separator />

        <q-card-actions class="flex justify-end">
          <q-btn flat label="Guardar" color="primary" :loading="loadingEdit[0]" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { api } from 'boot/axios'
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const userProfile = ref(JSON.parse(localStorage.getItem('userLogin')))
const loadingEdit = ref([false])
const loginFormEdit = ref(null)
const $q = useQuasar()
const imagePreviewUrl = ref('')
//const profileuser = ref([])
const userFormProfile = ref({
  nombre: '',
  apellido: '',
  email: '',
  phone: '',
  puesto: '',
  area: '',
  turno: '',
  empleado: '',
  birthday: '',
  picture: ''
});

const fetchUsers = async () => {
  try {
    const idUser = userProfile.value.id;
    console.log('ID del usuario logueado' + (idUser))
    const response = await api.get(`/api/testers/${idUser}`)
    const profileuser = response.data // Almacenar los datos recibidos
    console.log(profileuser)

    userFormProfile.value = {
      nombre: profileuser.NAME,
      apellido: profileuser.LASTNAME,
      email: profileuser.EMAIL,
      phone: profileuser.PHONE,
      puesto: profileuser.WORKSTATION,
      area: profileuser.AREA,
      turno: profileuser.TURN,
      empleado: profileuser.NOEMPLOYEE,
      birthday: profileuser.BIRTHDAY,
      rol: profileuser.ROL,
      picture: profileuser.PICTURE
    }

    imagePreviewUrl.value = profileuser.PICTURE || '../../../public/imgs/NoIMgae.png'
    if (userFormProfile.value.picture) {
      imagePreviewUrl.value = `http://localhost:3000/uploads/${userFormProfile.value.picture}`;
    }

  } catch (error) {

    console.error('Error fetching users:', error)
    $q.notify({
      color: 'warning',
      message: 'No hay usuarios registrados',
      icon: 'warning',
    });

  }
}

onMounted(() => {
  fetchUsers()
})

/* watch(() => userFormProfile.value.picture, (newVal) => {
  // Update image preview when user selects a new image
  if (newVal) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreviewUrl.value = reader.result;
    };
    reader.readAsDataURL(newVal);
  } else {
    // Set default image if no picture is selected
    imagePreviewUrl.value = "../../../public/imgs/NoIMgae.png";
  }
}); */

function onImageSelected(file) {
  // Update the image preview when a file is added
  imagePreviewUrl.value = URL.createObjectURL(file);
}

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

defineOptions({
  name: 'EditProfilePage'
});
</script>
