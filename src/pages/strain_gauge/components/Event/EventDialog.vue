<template>
  <q-dialog :model-value="event_dialog" persistent>
    <q-card style="width: 80vw; max-width: 80vw; max-height: 80vh; ">
      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator v-if="this.current_user.rol !== 'SG Full' || this.current_user.rol !== 'Administrador'">
        <q-tab :ripple="false" name="info" label="Información" />
      </q-tabs>
      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator v-else>
        <q-tab :ripple="false" name="info" label="Información" />
        <q-tab v-if="status != 'Finalizado' && status != 'Cancelado'" :ripple="false" name="update" label="Modificar" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">
          <EventInfo :event_id="event_id" @reload="reload" />
        </q-tab-panel>
        <q-tab-panel name="update">
          <EventUpdate :event_id="event_id" @move="move" @reload="reload" />
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right" class="vertical-bottom">
        <q-btn flat label="Cerrar" color="dark" @click="event_dialog = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import EventInfo from './EventInfo.vue';
import EventUpdate from './EventUpdate.vue';
import { api } from 'boot/axios'

export default {
  setup() {

  },
  components: {
    EventInfo,
    EventUpdate
  },
  emits: ['reload'],
  data() {
    return {
      event_dialog: false,
      tab: 'info',
      event_id: '',
      status: '',

      current_user: {},
    }
  },
  methods: {
    openDialog(id) {
      this.event_dialog = true;
      this.event_id = id;
      this.getData()
    },
    reload() {
      // this.tab = 'info'
      this.getData()
      this.$emit('reload')
    },
    move() {
      this.tab = 'info'
      this.getData()
      this.$emit('reload')
    },
    getData() {
      api.get('/strain_gauge/' + this.event_id).then((response) => {
        var data = response.data[0];
        this.status = data.STATUS_SG
      }).catch((error) => {
        console.error(error);
      })
    }
  },
  mounted() {
    this.current_user = JSON.parse(localStorage.getItem("userLogin"))
  },
}
</script>
