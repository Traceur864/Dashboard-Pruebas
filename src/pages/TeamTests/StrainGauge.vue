<template>
  <q-page>
    <div class="text-h4 text-center q-py-md">
      Calendario de Strain Gauge
    </div>

    <div class="row q-px-sm q-col-gutter-x-sm">
      <div class="col-7">
        <FullCalendar :options="calendarOptions" />
      </div>

      <div class="col column justify-center">
        <div class="col-auto self-end q-pb-lg">
          <q-btn class="q-mt-md q-mx-sm" color="secondary" label="Administrar Testers"
            @click="this.tester_dialog = true" />
          <q-btn class="q-mt-md" color="secondary" label="Administrar Fixturas"
            @click="this.$refs.fixtureDialog.openDialog()" />
        </div>
        <div class="q-col-gutter-y-md">
          <div class="row q-col-gutter-x-sm">
            <div class="col">
              <q-select square filled v-model="modelo" label="Modelo" :options="models" />
            </div>
            <div class="col">
              <q-select square filled v-model="area" label="Area en la que se realiza" :options="areas" />
            </div>
          </div>

          <q-select ref="tester_select" v-on:update:model-value="prueba" :disable="disable" square filled
            v-model="tester_sn" label="SN del tester" :options="tester_serialnumbers" />
          <q-select ref="fixture_select" :disable="disable" square filled v-model="fixture_id" label="ID de la fixtura"
            :options="fixture_ids" />
          <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />

          <div class="row q-col-gutter-x-sm">
            <div class="col">
              <q-select square filled v-model="shift" label="Turno" :options="['Turno 1', 'Turno 2', 'Turno 3']" />
            </div>
            <div class="col">
              <q-select square filled v-model="asigned_to" label="Responsable de SG" :options="monitos" />
            </div>
          </div>

        </div>

        <div class="col-auto self-end">
          <q-btn class="q-mt-md" color="positive" label="Agendar mantenimiento nuevo" @click="add_event()" />
        </div>

      </div>
    </div>
    <!-- ==================== DIALOGS ==================== -->
    <TesterDialog v-model="tester_dialog" @reload="loadData" />
    <FixtureDialog ref="fixtureDialog" @reload="loadData" />
  </q-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

//Enable Api requests
import { api } from 'boot/axios'

//Importing components
import TesterDialog from './Components/StrainGauge/Tester/TesterDialog.vue'
import FixtureDialog from './Components/StrainGauge/Fixture/FixtureDialog.vue'

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    TesterDialog,
    FixtureDialog,
  },
  data() {
    return {
      //Calendar options
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        weekNumbers: true,
        navLinks: true,
        height: "auto",
        contentHeight: "auto",
        headerToolbar: {
          left: 'dayGridMonth,today',
          center: 'title',
          right: 'prev,next'
        }
      },

      //Global variables
      tester_serialnumbers: [],
      testers: [],
      fixture_ids: [],
      fixtures: [],

      areas: [],

      monitos: [
        "Juan Carlos",
        'Miguelito',
        'Joss',
        'Raúl'
      ],

      current_date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),

      //Model variables
      area: null,
      tester_sn: null,
      fixture_id: null,
      start_date: null,
      shift: null,
      modelo: null,
      asigned_to: null,
      tester_dialog: false,
      models: null,
      disable: true,
    }
  },
  //Get functionalities from imported component
  mixins: [TesterDialog],
  //Functions inside component
  methods: {
    prueba() {
      alert("Hola")
    },
    add_event() {
      console.log(this.$refs.tester_select.disable);
      this.disable = false

      if (this.tester_sn && this.fixture_id && this.start_date && this.shift && this.asigned_to) {
        this.calendarOptions.events.push(
          {
            'title': t_sn + f_id,
            'start': this.start_date,
            'end': this.start_date,
            'color': "#433DE3",
            'editable': false,
            'calendar_id': 'Holi'
          })

        this.clear_fields()
      }
    },

    loadData() {
      api.get('/model').then((response) => {
        var data = response.data
        this.models = []
        for (const ele in data) {
          this.models.push({
            value: data[ele].ID_MODEL,
            label: data[ele].MODEL
          })
        }
      }).catch((err) => {
        console.error(err);
      })

      api.get('/area').then((response) => {
        var data = response.data
        this.areas = []
        for (const ele in data) {
          this.areas.push({
            value: data[ele].ID_AREA,
            label: data[ele].AREA
          })
        }
      }).catch((err) => {
        console.error(err);
      })

      api.get('/tester/active').then((response) => {
        var data = response.data
        this.tester_serialnumbers = []
        data.forEach(ele => {
          this.tester_serialnumbers.push({
            value: ele.ID_TESTER,
            label: ele.TESTER_SN
          })
          this.testers.push(ele.TESTER_SN)
        });

      }).catch((err) => {
        console.error(err);
      })

      api.get('/fixture/active').then((response) => {
        var data = response.data
        this.fixture_ids = []
        data.forEach(ele => {
          this.fixture_ids.push({
            value: ele.ID_FIXTURE,
            label: ele.FIXTURE_ID
          })
          this.fixtures.push(ele.FIXTURE_ID)
        });

      }).catch((err) => {
        console.error(err);
      })
    },

    clear_fields() {
      this.area = ""
      this.tester_sn = ""
      this.fixture_id = ""
      this.start_date = ""
      this.shift = ""
      this.asigned_to = ""
    },

    unlock_select() {
      console.log(this.modelo, this.area);
      if (this.modelo && this.area) {
        this.disable = false
      }
    }

  },
  setup() {
    return {
    }
  },
  mounted() {
    this.loadData()
  }
}

function get_color(type) {
  switch (type) {
    case 'Permiso sin goce':
      return '#342EEA'
    case 'Vacaciones':
      return '#59C62F'
    case 'Descanso':
      return '#D640BF'
    case 'Domingo laborado':
      return '#78351D'
    case 'Falta':
      return '#DB090A'
    default:
      break;
  }
}
</script>