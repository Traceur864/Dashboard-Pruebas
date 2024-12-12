<template>
  <q-page class="q-pa-lg column items-center justify-start">

    <span class="text-h3">Profile</span>

  </q-page>
</template>

<script setup>

function updateUser() {
  // Hacer la solicitud para actualizar el perfil
  api.put('/user/update', userTest.value)
    .then(response => {
      // Actualizar los datos de localStorage con los nuevos datos
      localStorage.setItem('userTest', JSON.stringify(response.data));

      // Actualizar los datos en la UI
      userTest.value = response.data;

      $q.notify({
        color: 'positive',
        message: 'Datos actualizados correctamente',
        icon: 'check',
      });
    })
    .catch(error => {
      $q.notify({
        color: 'negative',
        message: 'Error al actualizar los datos',
        icon: 'error',
      });
    });
}

defineOptions({
  name: 'ProfilePage'
});
</script>