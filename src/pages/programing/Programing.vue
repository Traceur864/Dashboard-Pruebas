<template>
  <q-page class="q-pa-lg">

    <p class="flex justify-center text-h4">Programming</p>

    <div class="flez row justify-between">
      <div class="col-5 q-gutter-sm">
        <q-input v-model="date" filled type="date" hint="Native date" />
      </div>
      <div class="col-5 q-gutter-sm">
        <q-input v-model="date" filled type="date" hint="Native date" />
      </div>
    </div>
    <q-separator class="q-mt-lg"> </q-separator>


  </q-page>
</template>

<script setup>
defineOptions({
  name: 'ProgramminPage'
});
</script>
