<template>
  <q-page class="justify-center q-pa-md">
    <div class="flex justify-center">
      <span class="text-h2">Index Vue</span>
    </div>
    

    <div class="q-pa-md">
      <q-carousel
            v-model="slide"
            transition-prev="jump-right"
            transition-next="jump-left"
            swipeable
            animated
            control-color="black"
            prev-icon="las la-angle-left"
            next-icon="las la-angle-right"
            navigation-icon="none"
            navigation
            padding
            arrows
            height="300px"
            class="bg-whites text-black shadow-1 rounded-borders"
          >
            <q-carousel-slide name="style" class="no-wrap flex-start">
              <Organigrama/>
            </q-carousel-slide>
        </q-carousel>
    </div>

    
  </q-page>
</template>

<script setup>

import Organigrama from './TeamTests/Organigrama.vue'

import { ref } from 'vue'
const slide = ref('style')

  defineOptions({
    name: 'IndexPage'
  });
  
</script>
