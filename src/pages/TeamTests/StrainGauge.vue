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
          <div class="text-h6">Guía de colores</div>
          <div class="col">
            <q-badge color="purple" class="q-mx-xs" label="En proceso">
              <q-tooltip class="text-caption">El Strain Gauge se encuentra en proceso de realización</q-tooltip>
            </q-badge>

            <q-badge color="negative" class="q-mx-xs" label="Fallido">
              <q-tooltip class="text-caption">El Strain Gauge aún no se ha realizado y está en su fecha de
                realización</q-tooltip>
            </q-badge>

            <q-badge color="primary" class="q-mx-xs" label="Asignado">
              <q-tooltip class="text-caption">El Strain Gauge está agendado y aún no hay fecha limite</q-tooltip>
            </q-badge>

            <q-badge color="deep-orange" class="q-mx-xs" label="Atrasado">
              <q-tooltip class="text-caption">El Strain Gauge se encuentra a 3 días o menos de su fecha de
                realización</q-tooltip>
            </q-badge>

            <q-badge color="positive" class="q-mx-xs" label="Finalizado">
              <q-tooltip class="text-caption">El Strain Gauge completado extosamente</q-tooltip>
            </q-badge>

            <q-badge color="dark" text-color="white" label="Cancelado">
              <q-tooltip class="text-caption">El Strain Gauge se ha cancelado por completo</q-tooltip>
            </q-badge>
          </div>
        </div>
        <div class="col-auto self-end q-pb-lg">
          <q-btn class="q-mt-md q-mx-sm" color="secondary" label="Historial"
            @click="this.$refs.showEvents.openDialog()" />
          <q-btn class="q-mt-md q-mx-sm" color="secondary" label="Administrar Testers"
            @click="this.$refs.testerDialog.openDialog()" />
          <q-btn class="q-mt-md" color="secondary" label="Administrar Fixturas"
            @click="this.$refs.fixtureDialog.openDialog()" />
        </div>
        <div class="q-col-gutter-y-md">

          <q-select ref="tester_select" square filled v-model="tester_sn" label="SN del tester"
            :options="tester_serialnumbers" @filter="filterTest" use-input input-debounce="0" />

          <q-select ref="fixture_select" square filled v-model="fixture_id" label="ID de la fixtura"
            :options="fixture_ids" @filter="filterFix" use-input input-debounce="0" />

          <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />

          <div class="row q-col-gutter-x-sm">
            <div class="col">
              <q-select square filled v-model="shift" label="Turno" :options="['Turno 1', 'Turno 2', 'Turno 3']" />
            </div>
            <div class="col">
              <q-select square filled v-model="asigned_to" label="Responsable de SG" :options="usuarios"
                @filter="filterUser" use-input input-debounce="0" />
            </div>
          </div>

        </div>

        <div class="col-auto self-end">
          <q-btn class="q-mt-md" color="positive" label="Agendar mantenimiento nuevo" @click="add_event()" />
        </div>

      </div>
    </div>
    <!-- ==================== DIALOGS ==================== -->
    <TesterDialog ref="testerDialog" @reload="reload" />
    <FixtureDialog ref="fixtureDialog" @reload="reload" />
    <EventDialog ref="eventDialog" @reload="reload" />
    <ShowEvents ref="showEvents" @reload="reload" />
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
import EventDialog from './Components/StrainGauge/Event/EventDialog.vue'
import ShowEvents from './Components/StrainGauge/Historic/ShowEvents.vue'

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    TesterDialog,
    FixtureDialog,
    EventDialog,
    ShowEvents
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
        },
        eventClick: (event) => {
          this.$refs.eventDialog.openDialog(event.event.extendedProps.calendar_id);
        }
      },

      //Global variables
      tester_serialnumbers: [],
      testers: [],
      fixture_ids: [],
      fixtures: [],
      areas: [],
      usuarios: [],
      users: [],
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
  // mixins: [TesterDialog],
  //Functions inside component
  methods: {
    filterUser(val, update, abort) {
      if (val === '') {
        update(() => {
          this.usuarios = this.users
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.usuarios = this.usuarios.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterTest(val, update, abort) {
      if (val === '') {
        update(() => {
          this.tester_serialnumbers = this.testers
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.tester_serialnumbers = this.tester_serialnumbers.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFix(val, update, abort) {
      if (val === '') {
        update(() => {
          this.fixture_ids = this.fixtures
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.fixture_ids = this.fixtures.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    eventInfo(info) {
      this.$refs.eventDialog.openDialog(info.event.extendedProps.calendar_id);
    },
    reload() {
      this.loadData()
    },
    add_event() {
      if (this.tester_sn && this.fixture_id && this.start_date && this.shift && this.asigned_to) {
        const dismiss = this.$q.notify({
          spinner: true,
          message: "Por favor, espera...",
          timeout: 0
        })

        const params = new URLSearchParams()
        params.append('tester_id', this.tester_sn.value)
        params.append('fixture_id', this.fixture_id.value)
        params.append('start_date', this.start_date)
        params.append('shift', this.shift)
        params.append('asigned_to', this.asigned_to.value)

        const config = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        api.post('/strain_gauge', params, config).then((response) => {
          dismiss()
          this.$q.notify({
            type: "positive",
            message: response.data,
            position: 'top'
          })

          this.get_events()

        }).catch((errors) => {

          var error = errors.response.data.error
          console.error(error);

          error.forEach(err => {
            this.$q.notify({
              type: 'negative',
              message: err.msg,
              position: "top"
            })
          });

          dismiss()
        })
        this.clear_fields()
      } else {
        this.$q.notify({
          type: 'negative',
          message: "Por favor llena todos los campos",
          position: "right",
          timeout: 1200
        })
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
        this.testers = []
        data.forEach(ele => {
          this.tester_serialnumbers.push({
            value: ele.ID_TESTER,
            label: ele.TESTER_SN
          })
          this.testers.push({
            value: ele.ID_TESTER,
            label: ele.TESTER_SN
          })
        });

      }).catch((err) => {
        console.error(err);
      })

      api.get('/fixture/active').then((response) => {
        var data = response.data
        this.fixture_ids = []
        this.fixtures = []
        data.forEach(ele => {
          this.fixture_ids.push({
            value: ele.ID_FIXTURE,
            label: ele.FIXTURE_ID
          })
          this.fixtures.push({
            value: ele.ID_FIXTURE,
            label: ele.FIXTURE_ID
          })
        });

      }).catch((err) => {
        console.error(err);
      })

      api.get('/users/testusers').then((response) => {
        var data = response.data
        this.usuarios = []
        data.forEach(dat => {
          this.usuarios.push({
            value: dat.ID_USER,
            label: dat.NAME + " " + dat.LASTNAME
          })
        });
        this.users = this.usuarios
      }).catch((err) => {
        console.error(err);
      })

      this.get_events()
    },

    get_events() {
      this.calendarOptions.events = []

      api.get('/strain_gauge').then((response) => {
        var data = response.data
        data.forEach(el => {

          this.calendarOptions.events.push(
            {
              'title': "Tester: " + el.TESTER_SN + ", Fixtura:" + el.FIXTURE_ID,
              'start': el.START_DATE.substring(0, 10),
              'end': el.START_DATE.substring(0, 10),
              'color': getColor(setStatus(el.STATUS_SG, el.START_DATE)),
              'editable': false,
              'calendar_id': el.ID_EVENT
            })
        });
      }).catch((error) => {
        console.error(error);
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
    let self = this
    this.loadData()
  },
  watch: {
    modelo: function () {
      console.log(this.modelo.value);
    }
  }
}

function getColor(status) {
  switch (status) {
    case 'En proceso':
      return 'purple'
    case 'Por expirar':
      return '#F2C037'
    case 'Fallido':
      return '#C10015'
    case 'Asignado':
      return 'primary'
    case 'Atrasado':
      return '#FF5722'
    case 'Finalizado':
      return '#21BA45'
    default:
      return 'black'
  }
}

function setStatus(status, start_date) {
  switch (status) {
    case 'En proceso':
      return 'En proceso'
    case 'Finalizado':
      return 'Finalizado'
    case 'Asignado':
      var date = new Date(start_date)
      var today = new Date(new Date().toDateString())
      var btw = days_between(today, date)

      if (btw < 3 && btw > 0) {
        return 'Atrasado'
      } else if (btw <= 0) {
        return 'Fallido'
      } else {
        return 'Asignado'
      }
  }
}

function days_between(date1, date2) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;
  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  var days = Math.round(differenceMs / ONE_DAY)

  if (date1 > date2) {
    days = days * -1;
  }

  return days;
}
</script>