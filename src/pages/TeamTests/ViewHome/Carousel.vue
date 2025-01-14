<template>

  <div class="q-pa-md">

    <div v-if="testusersView.length === 0" class="flex justify-center q-pa-md">
      <p>No hay usuarios disponibles.</p>
    </div>

    <div class="q-gutter-md" v-else>
      <div>
        <q-btn-group push v-if="userProfileIndex.rol == 'Administrador'">
          <q-btn flat label="Organigrama" color="black" icon-right="arrow_right_alt" @click="goToOrganigrama" />
        </q-btn-group>

      </div>
      <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated
        control-color="black" navigation padding arrows height="250px"
        class="bg-blue-grey-1 text-black shadow-1 rounded-borders">
        <q-carousel-slide v-for="(userGroup, index) in userGroups" :key="index" :name="index"
          class="row items-center justify-center">
          <div v-for="test in userGroup" :key="test.ID_USER" class="col-3 q-pa-sm">
            <q-card class="my-card">
              <q-card-section class="q-pa-md">
                <div class="flex items-center justify-center">
                  <q-avatar size="72px" font-size="52px" v-if="test.PICTURE">
                    <img :src="'http://localhost:3000/uploads/' + test.PICTURE" :alt="test.NAME" />
                  </q-avatar>
                  <q-avatar size="100px" font-size="52px" v-else>
                    <img src="../../../../public/imgs/NoIMgae.png" :alt="test.NAME" />
                  </q-avatar>
                </div>
              </q-card-section>
              <q-card-section class="text-center bg-teal-14 q-pa-sm">
                <div class="text-weight-medium text-subtitle1">{{ test.NAME }} {{ test.LASTNAME }}</div>
                <div class="text-weight-light text-subtitle2">{{ test.WORKSTATION }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>

</template>
<script setup>
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

const testusersView = ref([])
const $q = useQuasar()
const router = useRouter()
const slide = ref(0)
const userProfileIndex = ref(JSON.parse(localStorage.getItem('userLogin')))

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/testusers') // Asegúrate de que esta URL sea correcta según tu backend
    testusersView.value = response.data // Almacenar los datos recibidos

    console.log(response.data);

  } catch (error) {

    console.error('Error fetching users:', error)
    $q.notify({
      color: 'warning',
      message: 'No hay usuarios registrados',
      icon: 'warning',
    });

  }
}

const changeSlide = () => {
  slide.value = (slide.value + 1) % userGroups.value.length  // Ciclar entre los grupos
}

// Función para dividir los usuarios en grupos de 4
const userGroups = computed(() => {
  const groups = []
  for (let i = 0; i < testusersView.value.length; i += 4) {
    groups.push(testusersView.value.slice(i, i + 4)) // Crear grupos de 4 usuarios
  }
  return groups
})

// Llamar a la función cuando se monta el componente
onMounted(() => {
  fetchUsers()  // Cargar los usuarios al iniciar
  setInterval(changeSlide, 4000)  // Cambiar de diapositiva cada 3 segundos
})

function goToOrganigrama() {
  router.push({ name: 'organigrama' })
}

defineOptions({
  name: 'CarouselPage'
});
</script>
