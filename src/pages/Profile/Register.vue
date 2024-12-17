<template>
    <q-page class="q-pa-md">

        <div class="flex flex-center q-pa-lg">
            <q-card class="create-account-card" style="width: 400px">

                <q-card-section>
                    <span class="text-h5 text-weight-regular"
                        style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Registro</span>
                </q-card-section>
                <q-card-section>
                    <q-form @submit="handleRegister" ref="registerForm">
                        <q-input v-model="userFormRegister.name" label="Nombre" type="text"
                            :rules="[val => val && val.length > 0 || 'Este campo es requerido']" outlined dense />
                        <q-input v-model="userFormRegister.email" label="Correo" type="email" outlined dense
                            class="q-mb-md" hint="Este campo es Opcional" />
                        <q-input v-model="userFormRegister.password" label="Contraseña"
                            :type="isPwd ? 'password' : 'text'" :rules="[
                                val => val && val.length > 0 || 'Este campo es requerido',
                                val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                                val => val.length <= 12 || 'La contraseña debe tener un maximo de 12 caracteres',
                            ]" outlined dense counter>
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <div class="flex justify-between q-mt-md">
                            <q-btn label="Iniciar sesión" flat push no-caps @click="goToLogin" />
                            <q-btn label="Registrar" icon-right="las la-sign-in-alt" color="secondary" type="submit"
                                push no-caps :align="between" :loading="loading[0]" />
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

const userFormRegister = ref({
    name: '',
    email: '',
    password: ''
})

const loading = ref([false])
const registerForm = ref(null)
const isPwd = ref(true)

function handleRegister() {
    // Validar si el formulario es válido antes de iniciar el proceso de carga
    if (registerForm.value && registerForm.value.validate()) {
        // Si es válido, activar el loading
        console.log(registerForm.value)

        simulateProgress(0);
    }
}

function simulateProgress(number) {
    // Activamos el estado de carga
    loading.value[number] = true;
    console.log([
        userFormRegister.value.name,
        userFormRegister.value.email,
        userFormRegister.value.password
    ]);


    const formData = new FormData()

    formData.append('name', userFormRegister.value.name)
    formData.append('email', userFormRegister.value.email)
    formData.append('password', userFormRegister.value.password)

    api.post('/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {

        console.log(response.data);
        loading.value[number] = false

        $q.notify({
            color: 'positive',
            message: 'Registro completado con éxito.',
            icon: 'check'
        })

        router.push({ name: 'login' })

    }).catch(error => {

        loading.value[number] = false

        console.error(error)
        $q.notify({
            color: 'negative',
            message: 'Hubo un error al registrar al usuario.',
            icon: 'error'
        })
    })
    // Hacer la solicitud de login al backend
}

const goToLogin = () => {
    router.push({ name: 'login' })
}

defineOptions({
    name: 'RegisterPage'
});

</script>