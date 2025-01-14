<template>
  <q-page class="justify-center q-pa-md">
    <div class="flex justify-center">
      <span class="text-h4">Home</span>
    </div>

    <Carousel></Carousel>

  </q-page>
</template>

<script setup>
import Carousel from '../pages/TeamTests/ViewHome/Carousel.vue'

defineOptions({
  name: 'IndexPage'
});

</script>
