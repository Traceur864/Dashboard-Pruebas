<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">Información</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="flex row q-pa-sm">
        <div class="col-4">
          <q-avatar size="150px" font-size="52px" v-if="!UserTest.PICTURE == '' || !UserTest.PICTURE == null">
            <img :src="'http://localhost:3000/uploads/' + UserTest.PICTURE" />
          </q-avatar>
          <q-avatar size="150px" font-size="52px" v-else>
            <img src="../../../../public/imgs/NoIMgae.png" />
          </q-avatar>
        </div>
        <div class="col-3 column">
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md">
            <q-icon name="las la-signature" color="black" size="20px" class="q-mr-sm" />
            Nombre:
          </span>
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md">

            <q-icon name="las la-at" color="black" size="20px" class="q-mr-sm" />

            Correo:
          </span>
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md">

            <q-icon name="las la-mobile-alt" color="black" size="20px" class="q-mr-sm" />

            Teléfono:
          </span>
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md">

            <q-icon name="las la-id-card" color="black" size="20px" class="q-mr-sm" />

            No. Empleado:
          </span>
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md" v-if="UserTest.ROL != null">

            <q-icon name="las la-user-tag" color="black" size="20px" class="q-mr-sm" />

            Rol:
          </span>
          <span class="text-subtitle1 text-weight-medium q-mb-sm q-ml-md" v-else>

          </span>
        </div>
        <div class="col-5 column">
          <span class="text-subtitle1 q-mb-sm q-ml-lg">{{ UserTest.NAME }} {{ UserTest.LASTNAME }}</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg" v-if="UserTest.EMAIL !== null">{{ UserTest.EMAIL }}</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg" v-else>No hay correo Asignado</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg">{{ UserTest.PHONE }}</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg">{{ UserTest.NOEMPLOYEE }}</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg" v-if="UserTest.ROL != null">{{ UserTest.ROL
            }}</span>
          <span class="text-subtitle1 q-mb-sm q-ml-lg" v-else></span>
        </div>
      </div>

      <div class="flex row justify-between q-ma-lg">
        <div class="col-2">
          <span class="text-subtitle1 text-weight-medium">

            <q-icon name="las la-briefcase" color="black" size="20px" class="q-mr-sm" />

            Puesto:
          </span>
        </div>
        <div class="col-4">
          <span class="text-subtitle1 q-ml-md">{{ UserTest.WORKSTATION }}</span>
        </div>
        <div class="col-2">
          <span class="text-subtitle1 text-weight-medium">

            <q-icon name="las la-thumbtack" color="black" size="20px" class="q-mr-sm" />

            Area:
          </span>
        </div>
        <div class="col-4">
          <span class="text-subtitle1 q-ml-md">{{ UserTest.AREA }}</span>
        </div>
      </div>
      <div class="flex row justify-between q-ma-lg">
        <div class="col-2">
          <span class="text-subtitle1 text-weight-medium">

            <q-icon name="las la-user-clock" color="black" size="20px" class="q-mr-sm" />

            Turno:
          </span>
        </div>
        <div class="col-4">
          <span class="text-subtitle1 q-ml-md">{{ UserTest.TURN }}</span>
        </div>
        <div class="col-2">
          <span class="text-subtitle1 text-weight-medium">

            <q-icon name="las la-birthday-cake" color="black" size="20px" class="q-mr-sm" />

            Birthday:
          </span>
        </div>
        <div class="col-4">
          <span class="text-subtitle1 q-ml-md">{{ UserTest.BIRTHDAY }}</span>
        </div>
      </div>

      <q-separator />

      <q-card-actions class="flex justify-end">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>

    </q-card-section>
  </q-card>

</template>

<script setup>

const props = defineProps({
  UserTest: {
    type: Array,
    required: true
  }
})

defineOptions({
  name: 'InfoUser'
});
</script>
