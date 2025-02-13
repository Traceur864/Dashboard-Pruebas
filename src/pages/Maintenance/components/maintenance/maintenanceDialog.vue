<template>
  <q-dialog :model-value="dialogInfo" persistent>
    <q-card style="width: 80vw; max-width: 80vw; max-height: 80vh; ">

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>

        <q-tab :ripple="false" name="modificar" label="Modificar" />
        <q-tab :ripple="false" name="info" label="Información extra" />

      </q-tabs>


      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="modificar">
          <MaintenanceUpdate :id_maintenance="id_maintenance" @reload="reload" />
        </q-tab-panel>
        <q-tab-panel name="info">
          <MaintenanceInfo :id_maintenance="id_maintenance" @reload="reload" />
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions vertical align="right">
        <q-btn flat label="Cerrar" @click="dialogInfo = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { api } from 'boot/axios'
import MaintenanceUpdate from './maintenanceUpdate.vue';
import MaintenanceInfo from './maintenanceInfo.vue';

export default {
  components: {
    MaintenanceUpdate,
    MaintenanceInfo
  },
  data() {
    return {
      //Global variables
      dialogInfo: false,
      tester_serialnumbers: [],
      testers: [],
      atm_sns: [],
      atms: [],
      fixtures_sns: [],
      fixtures: [],
      event_tps: ['Calibración', 'Mantenimiento'],
      tab: 'modificar',

      //Model variables
      tester_sn: null,
      fixture_sn: null,
      atm_sn: null,
      event_type: null,
      start_date: null,
      id_maintenance: null,
    }
  },
  emits: ['reload'],
  methods: {
    reload() {
      this.$emit('reload')
    },
    openDialog(id) {
      this.id_maintenance = id
      this.dialogInfo = true
    }
  }
}
</script>
