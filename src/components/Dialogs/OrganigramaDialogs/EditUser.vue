<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">Editar</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="HandleLoginEdit" ref="loginFormEdit">
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormEdit.nombre" label="Nombre(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormEdit.apellido" label="Apellido(s)" type="text" color="grey-3"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-signature" color="secondary" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-between q-mb-md">
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormEdit.email" label="Correo electrónico" color="grey-3"
              type="email" label-color="secondary" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-at" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormEdit.phone" label="Teléfono" color="grey-3" type="number"
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
            <q-select dense square filled v-model="userFormEdit.puesto" label="Puesto" color="grey-3"
              label-color="secondary" :options="optionsJob" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-briefcase" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
            <q-select dense square filled v-model="userFormEdit.area" label="Area" color="grey-3"
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
            <q-select dense square filled v-model="userFormEdit.turno" label="Turno" color="grey-3"
              label-color="secondary" :options="optionsTurn" lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-user-clock" color="secondary" />
              </template>
            </q-select>
          </div>
          <div class="col-md-5">
            <q-input dense square filled v-model="userFormEdit.empleado" label="No. Empleado" color="grey-3"
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
            <q-input dense square filled v-model="userFormEdit.birthday" label="Birthday" color="grey-3" type="date"
              label-color="secondary" lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es requerido']">
              <template v-slot:prepend>
                <q-icon name="las la-birthday-cake" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-md-5">
            <q-file dense square filled v-model="userFormEdit.picture" label="Foto" color="grey-3"
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
              <img src="../../../../public/imgs/NoIMgae.png" v-if="!imagePreviewUrl" />
              <img :src="imagePreviewUrl" v-else />
            </q-avatar>
          </div>
        </div>

        <q-separator />

        <q-card-actions class="flex justify-end">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" :loading="loadingEdit[0]" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { api } from 'boot/axios'
import { ref, defineProps, watch } from 'vue'
import { useQuasar } from 'quasar'

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()
const loadingEdit = ref([false])
const loginFormEdit = ref(null)
const $q = useQuasar()
const imagePreviewUrl = ref('');

const props = defineProps({
  UserTestEdit: {
    type: Object,
    required: true,
  }
});

const userFormEdit = ref({

  nombre: props.UserTestEdit.NAME,
  apellido: props.UserTestEdit.LASTNAME,
  email: props.UserTestEdit.EMAIL,
  phone: props.UserTestEdit.PHONE,
  puesto: props.UserTestEdit.WORKSTATION,
  area: props.UserTestEdit.AREA,
  turno: props.UserTestEdit.TURN,
  empleado: props.UserTestEdit.NOEMPLOYEE,
  birthday: props.UserTestEdit.BIRTHDAY,
  picture: props.UserTestEdit.PICTURE

});

function HandleLoginEdit() {

  if (loginFormEdit.value && loginFormEdit.value.validate()) {

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

function confirm() {

  $q.dialog({
    transitionShow: 'fade',
    dark: false,
    title: 'Confirmar',
    message: 'Valida los datos primero, Seguro(a)?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    simulateProgress(0)
  }).onOk(() => {
    console.log('simulateProgress')
  }).onCancel(() => {
    console.log('The user cancelled')
  })

}

async function simulateProgress(number) {
  // Activamos el estado de carga
  loadingEdit.value[number] = true;

  const userId = props.UserTestEdit.ID_USER;

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
    formData.append('name', userFormEdit.value.nombre);
    formData.append('lastname', userFormEdit.value.apellido);
    formData.append('email', userFormEdit.value.email);
    formData.append('phone', userFormEdit.value.phone);
    formData.append('workstation', userFormEdit.value.puesto);
    formData.append('area', userFormEdit.value.area);
    formData.append('turn', userFormEdit.value.turno);
    formData.append('noemployee', userFormEdit.value.empleado);
    formData.append('birthday', userFormEdit.value.birthday);

    if (userFormEdit.value.picture) {
      formData.append('picture', userFormEdit.value.picture)
    }

    const response = await api.put(`api/testers/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status === 200) {
      // Si la actualización fue exitosa
      emit('reloadEdit')
      $q.notify({
        color: 'positive',
        message: 'Usuario actualizado correctamente.',
        icon: 'check',
      });
      // Aquí puedes emitir un evento de cierre o redirigir a otro lugar si es necesario
      cancel()
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

function cancel() {
  // Aquí emitimos el evento 'close-dialog' al componente padre
  emit('close-dialog-Edit');
}
// FUnciones de evento 'Imagen'-----
watch(() => userFormEdit.value.picture, (newVal) => {
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
});

if (userFormEdit.value.picture) {
  imagePreviewUrl.value = `http://localhost:3000/uploads/${userFormEdit.value.picture}`;
}

function onImageSelected(file) {
  // Update the image preview when a file is added
  imagePreviewUrl.value = URL.createObjectURL(file);
}
// ----------------------------------------------------------------

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
  'Turno 1',
  'Turno 2',
  'Turno 3'
]

defineOptions({
  name: 'EditUser'
});
</script>