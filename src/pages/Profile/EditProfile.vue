<template>
  <q-card flat bordered style="width: 50vw;">
    <q-card-section>
      <q-form @submit="HandleLoginEdit" ref="profileFormEdit">
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userFormProfile.name" label="Nombre(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userFormProfile.lastname" label="Apellido(s)" type="text"
              color="grey-3" label-color="secondary" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md" v-if="userProfileEdit.rol == 'Administrador'">
            <q-input dense square filled v-model="userFormProfile.email" label="Correo electrónico" color="grey-3"
              type="email" label-color="secondary">
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md" v-else>
            <q-input dense square filled v-model="userFormProfile.email" label="Correo electrónico" color="grey-3"
              type="email" label-color="secondary" disable>
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
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
          <div class="col-md-6 q-gutter-md" v-if="userFormProfile.rol == 'Administrador'">
            <q-select dense square filled v-model="userFormProfile.workstation" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-else>
            <q-select dense square filled v-model="userFormProfile.workstation" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']" disable>
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-if="userFormProfile.rol == 'Administrador'">
            <q-select dense square filled v-model="userFormProfile.area" label="Area" color="grey-3"
              label-color="secondary" :options="optionsArea" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-thumbtack" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-else>
            <q-select dense square filled v-model="userFormProfile.area" label="Area" color="grey-3"
              label-color="secondary" :options="optionsArea" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']" disable>
              <template v-slot:prepend>
                <q-icon name="las la-thumbtack" color="secondary" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md" v-if="userFormProfile.rol == 'Administrador'">
            <q-select dense square filled v-model="userFormProfile.turn" label="Turno" color="grey-3"
              label-color="secondary" :options="optionsTurn" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-else>
            <q-select dense square filled v-model="userFormProfile.turn" label="Turno" color="grey-3"
              label-color="secondary" :options="optionsTurn" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']" disable>
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-if="userFormProfile.rol == 'Administrador'">
            <q-input dense square filled v-model="userFormProfile.noemployee" label="No. Empleado" color="grey-3"
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
          <div class="col-md-6 q-gutter-md" v-else>
            <q-input dense square filled v-model="userFormProfile.noemployee" label="No. Empleado" color="grey-3"
              type="number" label-color="secondary" counter maxlength="8" lazy-rules :rules="[

                val => val && val.length > 0 || 'Este campo es requerido',
                val => val && val.length <= 8 || 'Please use maximum 8 characters',
                val => val && /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,14}$/.test(val) || 'Please use valid phone number',

              ]" disable>
              <template v-slot:prepend>
                <q-icon name="las la-id-card" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md">
            <q-input dense square filled v-model="userFormProfile.birthday" label="Birthday" color="grey-3" type="date"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-birthday-cake" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 q-gutter-md">
            <q-file dense square filled v-model="userFormProfile.picture" label="Foto" color="grey-3"
              label-color="secondary" counter accept="image/*" @added="onImageSelected">
              <template v-slot:prepend>
                <q-icon name="lar la-image" color="secondary" />
              </template>
            </q-file>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-6 q-gutter-md"
            v-if="userProfileEdit.rol == 'Administrador' && userProfileEdit.rol != null">
            <q-select dense square filled v-model="userFormProfile.rol" label="Rol" color="grey-3"
              label-color="secondary" :options="optionsRol">
              <template v-slot:prepend>
                <q-icon name="las la-user-tag" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-6 q-gutter-md" v-else>

          </div>
          <div class="flex justify-center col-md-6 q-gutter-md">
            <q-avatar size="50px" font-size="52px">
              <!-- Show the selected image or the default image -->
              <img :src="imagePreviewUrl || '../../../public/imgs/NoIMgae.png'" />
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

const userProfileEdit = ref(JSON.parse(localStorage.getItem('userLogin')))
const loadingEdit = ref([false])
const profileFormEdit = ref(null)
const $q = useQuasar()
const imagePreviewUrl = ref('')

// Referencia el tipo de dato al campo
const userFormProfile = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  workstation: '',
  area: '',
  turn: '',
  noemployee: '',
  birthday: '',
  picture: null
});

// Obtiene el ID del Usuario logueado para obtener os datos
const fetchUsers = async () => {
  try {
    const idUser = userProfileEdit.value.id;
    console.log('ID del usuario logueado' + (idUser))
    const response = await api.get(`/api/testers/${idUser}`)
    const profileuser = response.data // Almacenar los datos recibidos
    console.log(profileuser)

    userFormProfile.value = {
      name: profileuser.NAME,
      lastname: profileuser.LASTNAME,
      email: profileuser.EMAIL,
      phone: profileuser.PHONE,
      workstation: profileuser.WORKSTATION,
      area: profileuser.AREA,
      turn: profileuser.TURN,
      noemployee: profileuser.NOEMPLOYEE,
      birthday: profileuser.BIRTHDAY,
      rol: profileuser.ROL,
      picture: profileuser.PICTURE
    }

    //imagePreviewUrl.value = profileuser.PICTURE || '../../../public/imgs/NoIMgae.png'
    if (userFormProfile.value.picture) {
      imagePreviewUrl.value = `http://localhost:3000/uploads/${userFormProfile.value.picture}`;
    }

    watch(() => userFormProfile.value.picture, (newVal) => {
      // Update image preview when user selects a new image
      if (newVal) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreviewUrl.value = reader.result;
        };
        reader.readAsDataURL(newVal);
      } else {
        // Set default image if no picture is selected
        imagePreviewUrl.value = "../../../../public/imgs/NoIMgae.png";
      }
    })


  } catch (error) {

    console.error('Error fetching users:', error)
    $q.notify({
      color: 'warning',
      message: 'No hay usuarios registrados',
      icon: 'warning',
    });

  }
}

// Valida que cumpla con las reglas del formulario
function HandleLoginEdit() {

  if (profileFormEdit.value && profileFormEdit.value.validate()) {

    console.log('Validation passed')
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

// Alerta de confirmacion para asegurar el envio de datos
function confirm() {

  $q.dialog({
    transitionShow: 'fade',
    dark: false,
    title: 'Confirmar',
    message: 'Valida los datos primero, ¿Seguro(a)?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    simulateProgress(0)
    console.log('simulateProgress')
  }).onCancel(() => {
    console.log('The user cancelled')
  })

}

// Peticion a la api para realizar el cambio de datos modificados
async function simulateProgress(number) {
  // Activamos el estado de carga
  loadingEdit.value[number] = true;

  const idUser = userProfileEdit.value.id;
  console.log(idUser);


  if (!idUser) {
    $q.notify({
      color: 'negative',
      message: 'ID de usuario no encontrado.',
      icon: 'error'
    });
    return;
  }

  try {

    const formData = new FormData();
    formData.append('name', userFormProfile.value.name);
    formData.append('lastname', userFormProfile.value.lastname);
    formData.append('email', userFormProfile.value.email);
    formData.append('phone', userFormProfile.value.phone);
    formData.append('workstation', userFormProfile.value.workstation);
    formData.append('area', userFormProfile.value.area);
    formData.append('turn', userFormProfile.value.turn);
    formData.append('noemployee', userFormProfile.value.noemployee);
    formData.append('birthday', userFormProfile.value.birthday);

    if (userFormProfile.value.picture) {
      formData.append('picture', userFormProfile.value.picture)
    }

    if (userFormProfile.value.rol) {
      formData.append('rol', userFormProfile.value.rol)
    }

    const response = await api.put(`api/testers/${idUser}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status === 200) {

      // Actualiza el localStorage con los nuevos datos
      const updatedUser = { ...userFormProfile.value, id: idUser }; // Mantén el ID original
      localStorage.setItem('userLogin', JSON.stringify(updatedUser)); // Actualiza el localStorage

      $q.notify({
        color: 'positive',
        message: 'Usuario actualizado correctamente.',
        icon: 'check',
      })
    }
  } catch (error) {
    // Si ocurrió un error
    $q.notify({
      color: 'negative',
      message: 'Hubo un error al actualizar el usuario.',
      icon: 'error',
    });
    console.error('Error al actualizar el usuario:', error);
  } finally {
    // Detener el estado de carga
    loadingEdit.value[number] = false;
  }

}

onMounted(() => {
  fetchUsers()
})

// Recibe la imagen seleccionada por el usuario
function onImageSelected(files) {
  // Verifica si se ha seleccionado un archivo
  if (files && files[0]) {
    const file = files[0]; // Obtiene el primer archivo
    // Crea una URL temporal para la imagen seleccionada
    imagePreviewUrl.value = URL.createObjectURL(file);
    // También podemos actualizar el modelo de datos si queremos guardarlo
    userFormProfile.value.picture = file; // O almacenar la ruta del archivo si es necesario
  }
}

// Arrays de opciones para el formulario
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

const optionsRol = [
  'Administrador',
  'Full Programming',
  'Full ICT',
  'Full MDA',
  'Full ISP',
  'Full BSI',
  'SG Full',
  'M&C Full',
  'Jr Programming',
  'Jr ICT',
  'Jr MDA',
  'Jr ISP',
  'Jr BSI',
  'SG Jr',
  'M&C Jr',
]

defineOptions({
  name: 'EditProfilePage'
});
</script>
