<template>
    <q-page>

      <div class="row q-mb-md">
        <div class="col col-4 bg-primary"></div>
        <div class="col col-4 bg-secondary"></div>
        <div class="col col-4 bg-accent"></div>
      </div>

      <div class="row q-mb-md">
        <div class="col col-3 bg-primary"></div>
        <div class="col col-6 bg-secondary"></div>
        <div class="col col-3 bg-accent"></div>
      </div>

      <div class="row q-mb-md justify-between">
        <div class="col col-4 bg-secondary"></div>
        <div class="col col-4 bg-accent"></div>
      </div>

      <q-separator spaced/>

      <div class="row q-mb-md justify-between">
        <div class="col-12 col-sm-5 col-md-4 bg-secondary"></div>
        <div class="col-12 col-sm-5 col-md-4 bg-accent"></div>
      </div>
      
    </q-page>
  </template>
  
  <script setup>

  defineOptions({
    name: 'FlexPage'
  });
  </script>
  
<style scoped>

.col, .col-4, .col-3, .col-6 .col-12{
  height: 50px;
}
</style>