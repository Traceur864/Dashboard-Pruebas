<template>
  <q-page class="q-pa-lg column items-center justify-start">

    <div class="q-pa-md">
      <q-card bordered square>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="showprofile">
            <ShowProfile />
          </q-tab-panel>
          <q-tab-panel name="editprofile">
            <EditProfile />
          </q-tab-panel>
        </q-tab-panels>

        <q-separator></q-separator>
        <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>

          <q-tab :ripple="false" name="showprofile" label="Profile" />
          <q-tab :ripple="false" name="editprofile" label="Edit" />

        </q-tabs>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>

import EditProfile from './EditProfile.vue'
import ShowProfile from './ShowProfile.vue'

import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { ref, onMounted, watch } from 'vue'

const $q = useQuasar()
const testerusers = ref([])

const tab = ref('showprofile')

defineOptions({
  name: 'ProfilePage'
});
</script>
