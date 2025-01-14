<template>
  <q-card flat bordered class="my-card" style="width: 30vw;">
    <q-card-section>
      <div class="text-weight-medium text-subtitle1 text-center ">Profile</div>
    </q-card-section>

    <q-card-section class="flex justify-center q-pt-none">
      <q-avatar size="72px" font-size="52px" v-if="!userProfile.picture == '' || !userProfile.picture == null">
        <img :src="'http://localhost:3000/uploads/' + userProfile.picture" />
      </q-avatar>
      <q-avatar size="72px" font-size="52px" v-else>
        <img src="../../../public/imgs/NoIMgae.png" />
      </q-avatar>
    </q-card-section>

    <q-separator inset />
    <div class="row">
      <div class="col-6">
        <q-card-section class="flex column items-start">
          <span class="text-subtitle1 text-weight-bold">Rol:</span>
          <span class="text-subtitle1 text-weight-bold">Nombre:</span>
          <span class="text-subtitle1 text-weight-bold">No. Empleado:</span>
        </q-card-section>
      </div>
      <div class="col-6">
        <q-card-section class="flex column items-start">
          <span class="text-subtitle1">{{ userProfile.rol }}</span>
          <span class="text-subtitle1">{{ userProfile.name }} {{ userProfile.lastname }}</span>
          <span class="text-subtitle1">{{ userProfile.noemployee }}</span>
        </q-card-section>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <q-card-section class="flex justify-start">
          <span class="text-subtitle1 text-weight-bold">Turno:</span>
        </q-card-section>
      </div>
      <div class="col-6">
        <q-card-section class="flex justify-start">
          <span class="text-subtitle1">{{ userProfile.turn }}</span>
        </q-card-section>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <q-card-section class="flex column">
          <span class="text-subtitle1 text-weight-bold">Telefono:</span>
          <span class="text-subtitle1 text-weight-bold">Correo:</span>
        </q-card-section>
        <q-card-section class="flex column">
          <span class="text-subtitle1 text-weight-bold">Puesto de trabajo</span>
          <span class="text-subtitle1 text-weight-bold">Area</span>
        </q-card-section>
        <q-card-section class="flex">
          <span class="text-subtitle1 text-weight-bold">Cumpleaños:</span>
        </q-card-section>
      </div>
      <div class="col-6">
        <q-card-section class="flex column">
          <span class="text-subtitle1">{{ userProfile.phone }}</span>
          <span class="text-subtitle1">{{ userProfile.email }}</span>
        </q-card-section>
        <q-card-section class="flex column">
          <span class="text-subtitle1">{{ userProfile.workstation }}</span>
          <span class="text-subtitle1">{{ userProfile.area }}</span>
        </q-card-section>
        <q-card-section class="flex">
          <span class="text-subtitle1">{{ userProfile.birthday }}</span>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const userProfile = ref(JSON.parse(localStorage.getItem('userLogin')))

onMounted(() => {
  // Verifica que los datos se estén obteniendo correctamente
  console.log(userProfile.value);
});

defineOptions({
  name: 'ShowProfilePage'
})

</script>
