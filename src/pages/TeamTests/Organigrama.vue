<template>
  <q-page class="q-pa-md">

      <div class="q-pa-sm flex row">
        <q-card class="my-card q-ma-sm" v-for="(item, index) in items" :key="index">

          <!-- Sección para la imagen -->
          <q-card-section class="q-pa-lg">
            <div class="q-ma-lg">
              <q-avatar size="100px" font-size="52px">
                <img :src="item.img" :alt="item.alt"/>
              </q-avatar>
            </div>
          </q-card-section>

          <q-separator></q-separator>
          <!-- Sección para el texto -->
          <q-card-section class="text-center">
            <div class="text-weight-medium text-subtitle1">{{ item.name }}</div>
            <div class="text-weight-light text-subtitle2">{{ item.role }}</div>
          </q-card-section>
        </q-card>
      </div>
      

  </q-page>
</template>

<script setup>
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

defineOptions({
    name: 'OrganigramaPage'
});
</script>