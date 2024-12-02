<template>
  <q-page class="justify-center q-pa-md">
    <div class="flex justify-center">
      <span class="text-h4">Home</span>
    </div>

  </q-page>
</template>

<script setup>

import { ref } from 'vue'
const slide = ref('style')

defineOptions({
  name: 'IndexPage'
});

</script>
