<template>
  <q-page>
    <div class="text-h4 text-center q-py-md">
      Calendario de vacaciones
    </div>

    <div class="row q-px-sm q-col-gutter-x-sm">
      <div class="col-7">
        <FullCalendar :options="calendarOptions" />
      </div>

      <div class="col column justify-center">
        <div class="row">
          <div class="col-auto self-end q-pb-lg">
            <div class="text-h6">Guía de colores</div>
            <div class="col">
              <q-badge color="primary" class="q-mx-xs" label="Permiso sin goce"></q-badge>
              <q-badge color="positive" class="q-mx-xs" label="Vacaciones"></q-badge>
              <q-badge color="accent" class="q-mx-xs" label="Descanso"></q-badge>
              <q-badge color="teal" class="q-mx-xs" label="Domingo laborado"></q-badge>
              <q-badge color="negative" class="q-mx-xs" label="Falta"></q-badge>
              <q-badge color="black" text-color="white" label="4ta Falta"></q-badge>
            </div>
          </div>
        </div>
        <div class="row q-pb-md">
          <div class="col"></div>
          <div class="col-6">
            <q-select v-model="shift" :options="['Todos', 'Turno 1', 'Turno 2', 'Turno 3', 'Administrativo']"
              label="Turno" hint="Filtrar vacaciones por turno" square flat />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="q-col-gutter-y-md">
              <q-select square filled v-model="employee_name" label="Selecciona un empleado" :options="usuarios"
                @filter="filterUser" use-input input-debounce="0" />
              <q-select square filled v-model="event_type" label="Tipo de evento" :options="types" />
              <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />
              <q-input square filled v-model="end_date" :disable="enable_finish" :min="start_date" type="date"
                label="Fecha de fin" />
            </div>
          </div>
        </div>
        <div class="col-auto self-end">
          <q-btn class="q-mt-md q-mx-sm" color="primary" label="Historial de personal"
            @click="this.$refs.eventHistory.openDialog()" />
          <q-btn class="q-mt-md " color="positive" label="Agendar" @click="add_event()" />
        </div>

      </div>
    </div>
    <EventHistory ref="eventHistory" />
    <EventInfo @reload="getEvents" ref="eventInfo" />
  </q-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
//Enable Api requests
import { api } from 'boot/axios'
import EventHistory from './components/eventHistory.vue'
import EventInfo from './components/eventInfo.vue'

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    EventHistory,
    EventInfo,
  },
  data() {
    return {
      //Calendar options
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        height: "auto",
        contentHeight: "auto",
        headerToolbar: {
          left: 'dayGridMonth,today',
          center: 'title',
          right: 'prev,next'
        },
        eventClick: (event) => {
          this.$refs.eventInfo.openDialog(event.event.extendedProps.calendar_id);
        }
      },

      //Global variables
      types: [
        'Permiso sin goce',
        'Vacaciones',
        'Descanso',
        'Domingo laborado',
        'Falta'
      ],
      usuarios: [],
      current_date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
      enable_finish: true,

      //Model variables
      event_type: null,
      end_date: null,
      employee_name: null,
      start_date: null,
      shift: null,
    }
  },
  methods: {
    add_event() {
      if (this.event_type && this.start_date && this.end_date && this.employee_name) {
        const dismiss = this.$q.notify({
          spinner: true,
          message: "Por favor, espera...",
          timeout: 0
        })

        const params = new URLSearchParams()
        params.append('employee_id', this.employee_name.value)
        params.append('event_type', this.event_type)
        params.append('start_date', this.start_date)
        params.append('finish_date', this.end_date)
        params.append('created_by', 4)
        //  TODO: GET ID FROM LOGGED USER
        // params.append('created_by', this.created_by)

        const config = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        api.post('/vacation_calendar', params, config).then((response) => {
          this.$q.notify({
            message: response.data,
            type: 'positive',
            timeout: 2000,
            position: 'top'
          })

          //Reload data and clean fields
          this.clear()
          this.getEvents()

          dismiss()

        }).catch((error) => {

          var error = error.response.data.error
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
      } else {
        var error = err.response.data.error
        console.error(error);

        error.forEach(err => {
          this.$q.notify({
            type: 'negative',
            message: err.msg,
            position: "top"
          })
        });
      }
    },
    filter_vacations() {
      api.get('/vacation_calendar/shift/' + this.shift).then((response) => {
        var data = response.data
        this.calendarOptions.events = []
        data.forEach(dat => {
          let d = new Date(dat.FINISH_DATE.substring(0, 10))
          d.setDate(d.getDate() + 2)
          let end = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()

          this.calendarOptions.events.push({
            'title': dat.NAME + " " + dat.LASTNAME,
            'start': dat.START_DATE.substring(0, 10),
            'end': end,
            'calendar_id': dat.ID_VACATION,
            'color': get_color(dat.EVENT_TYPE),
            'editable': false
          })
        });

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
      })
    },
    loadData() {
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
    },
    getEvents() {
      api.get('/vacation_calendar/active').then((response) => {
        var data = response.data
        this.calendarOptions.events = []
        data.forEach(dat => {
          let d = new Date(dat.FINISH_DATE.substring(0, 10))
          d.setDate(d.getDate() + 2)
          let end = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())
            .toISOString().substring(0, 10)

          this.calendarOptions.events.push({
            'title': dat.NAME + " " + dat.LASTNAME,
            'start': dat.START_DATE.substring(0, 10),
            'end': end,
            'calendar_id': dat.ID_VACATION,
            'color': get_color(dat.EVENT_TYPE),
            'editable': false
          })
        });
      }).catch((error) => {
        console.error(error);
      })
    },
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
    clear() {
      this.employee_name = ''
      this.event_type = ''
      this.start_date = ''
      this.end_date = ''
      this.shift = ''
    }

  },
  setup() {
    return {
    }
  },
  mounted() {
    this.loadData()
    this.getEvents()
  },
  watch: {
    start_date: {
      handler: function (val) {
        if (val != "" && val != null) {
          this.enable_finish = false
        } else {
          this.enable_finish = true
          this.end_date = ""
        }
      },
      deep: true
    },
    shift: {
      handler: function (val) {
        if (val == "Todos") {
          this.getEvents()
        } else {
          this.filter_vacations()
        }
      }
    }
  }
}

function get_color(type) {
  switch (type) {
    case 'Permiso sin goce':
      return '#1976D2'
    case 'Vacaciones':
      return '#21BA45'
    case 'Descanso':
      return '#9C27B0'
    case 'Domingo laborado':
      return '#009688'
    case 'Falta':
      return '#C10015'
    case '4ta Falta':
      return '#000000'
    default:
      break;
  }
}
</script>