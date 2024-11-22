<template>
    <q-page class="flex column q-pa-md">
        <span class="text-h1">Typography</span>
        <span class="text-h2">Typography</span>
        <span class="text-h3">Typography</span>
        <span class="text-h4">Typography</span>
        <span class="text-h5">Typography</span>
        <span class="text-h6">Typography</span>

        <q-separator/>
          <span class="text-subtitle1">Subtitle1</span>
          <span class="text-subtitle2">Subtitle1</span>
        <q-separator/>

        <q-separator/>
          <span class="text-body1">Body1</span>
          <span class="text-body2">Body2</span>
        <q-separator/>
        
        <q-separator/>
          <span class="text-caption">Caption</span>
          <span class="text-overline">Overline</span>
        <q-separator/>

        <q-separator/>
          <span class="text-button">Button</span>
          <span class="text-link">Link</span>
        <q-separator/>

        <q-separator/>
          <span class="text-small">Small</span>
          <span class="text-medium">Medium</span>
          <span class="text-large">Large</span>
        <q-separator/>

        <q-separator/>
          <span class="text-primary">Primary</span>
          <span class="text-secondary">Secondary</span>
          <span class="text-tertiary">Tertiary</span>
        <q-separator/>

        <q-separator/>
          <span class="text-weight-bolder">Light</span>
          <span class="text-strike">Dark</span>
        <q-separator/>

        <q-btn
          color="primary" 
          label="Abrir menu lateral"
          class="q-mt-md"      
          @click="toggleSideMenu" 
        />

        <q-separator/>

        <div class="q-pa-md" style="max-width: 400px">

        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="name"
            label="Your name *"
            hint="Name and surname"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            filled
            type="number"
            v-model="age"
            label="Your age *"
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your age',
              val => val > 0 && val < 100 || 'Please type a real age'
            ]"
          />

          <q-toggle v-model="accept" label="I accept the license and terms" />

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>

        </div>
    </q-page>
  </template>
  
  <script setup>
  import { useQuasar } from 'quasar'
  import { ref } from 'vue'
  import useUI from '../composables/useUI'

  const { toggleSideMenu} = useUI()
  const $q = useQuasar()

  const name = ref(null)
  const age = ref(null)
  const accept = ref(false)

  function onSubmit () {
        if (accept.value !== true) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        }
        else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }
      }

function onReset () {
  name.value = null
  age.value = null
  accept.value = false
}

  defineOptions({
    name: 'TypographyPage'
  });
  </script>
  