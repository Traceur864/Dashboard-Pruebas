<template>
  <q-page class="q-pa-lg column items-center justify-start">




    <div class="flex flex-center q-pa-lg">
      <q-card class="create-account-card" style="width: 400px">

        <q-card-section>
          <span class="text-h4 text-weight-regular"
            style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Iniciar Sesión</span>
        </q-card-section>
        <q-card-section>
          <q-form @submit="handleLogin" ref="loginForm">
            <q-input v-model="userForm.email" label="Correo electrónico" type="email"
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

            <div class="flex justify-end q-mt-md">
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

  // Simulamos un retraso para simular un inicio de sesión
  setTimeout(() => {
    // Después de 3 segundos, desactivamos el estado de carga
    loading.value[number] = false;
    // Aquí puedes manejar lo que sucede después de intentar iniciar sesión, 
    // como redirigir a otra página o mostrar un mensaje de error
  }, 3000);


}

defineOptions({
  name: 'LoginPage'
});

</script>