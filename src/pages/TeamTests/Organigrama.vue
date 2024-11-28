<template>
  <q-page class="q-pa-md">

    <div class="flex row q-pa-md">
      <span class="text-h5 q-mr-sm">Testers</span>
      <div class="col-4">
      <q-btn 
        push
        flat
        label="Registrar" 
        color="black"
        @click="openDialog"
      />
      </div>
    </div>

    <q-dialog v-model="fixed" transition-show="fade" transition-hide="fade" transition-duration="300">
      <RegisterUser @close-dialog="closeDialog"/>
    </q-dialog>
    
    <TeamWork/>
      

  </q-page>
</template>

<script setup>

import { ref } from 'vue'
import RegisterUser from '../../components/Dialogs/OrganigramaDialogs/RegisterUser.vue'
import TeamWork from '../../components/Dialogs/OrganigramaDialogs/TeamWork.vue'

const fixed = ref(false)

function openDialog() {
  fixed.value = true;
}

function closeDialog() {
  fixed.value = false;
}

defineOptions({
    name: 'OrganigramaPage'
});
</script>