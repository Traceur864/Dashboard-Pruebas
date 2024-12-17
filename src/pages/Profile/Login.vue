<template>
  <q-page class="q-pa-lg column items-center justify-start">

    <div class="flex flex-center q-pa-lg">
      <q-card class="create-account-card" style="width: 400px">

        <q-card-section>
          <span class="text-h5 text-weight-regular"
            style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Iniciar Sesión</span>
        </q-card-section>
        <q-card-section>
          <q-form @submit="handleLogin" ref="loginForm">
            <q-input v-model="userForm.email" label="Nombre de Usuario o correo" type="text"
              :rules="[val => val && val.length > 0 || 'Este campo es requerido']" outlined dense />
            <q-input v-model="userForm.password" label="Contraseña" :type="isPwd ? 'password' : 'text'" :rules="[
              val => val && val.length > 0 || 'Este campo es requerido',
              val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
            ]" outlined dense>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>

            <div class="flex justify-between q-mt-md">
              <q-btn label="Registrar" flat @click="goToRegister" />
              <q-btn label="Iniciar sesión" icon-right="las la-sign-in-alt" color="secondary" type="submit" push no-caps
                :align="between" :loading="loading[0]" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()

const userForm = ref({
  email: '',
  password: ''
})

const loading = ref([false])
const loginForm = ref(null)
const isPwd = ref(true)

function handleLogin() {
  // Validar si el formulario es válido antes de iniciar el proceso de carga
  if (loginForm.value && loginForm.value.validate()) {
    // Si es válido, activar el loading
    console.log(userForm.value)

    simulateProgress(0);
  }
}

function simulateProgress(number) {
  // Activamos el estado de carga
  loading.value[number] = true;

  // Hacer la solicitud de login al backend
  api.post('/auth/login', userForm.value)
    .then(response => {
      // Si el login es exitoso, guardar el token en el localStorage
      const token = response.data.token;
      const userLogin = response.data.user;

      localStorage.setItem('authToken', token); // Guardar el token en localStorage
      localStorage.setItem('userLogin', JSON.stringify(userLogin)); // Guardar el user en localStorage

      // Opcional: Redirigir al usuario a otra página
      router.push({ name: 'home' }).then(() => {
        location.reload()
      })

    })
    .catch(error => {

      console.error('Error en el inicio de sesión:', error);

      // Verificar si el error tiene respuesta
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
          message: 'No se pudo conectar con el servidor',
          icon: 'warning',
        });

        loading.value[number] = false;
      }
    });

}

const goToRegister = () => {
  router.push({ name: 'register' })
}

defineOptions({
  name: 'LoginPage'
});

</script>
