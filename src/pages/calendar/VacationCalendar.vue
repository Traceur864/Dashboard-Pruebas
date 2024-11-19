<template>
  <q-page>
    <div class="text-h4 text-center q-py-md">
      Calendario de vacaciones
    </div>

    <div class="row q-px-sm q-col-gutter-x-sm">
      <div class="col-7">
        <FullCalendar :options="calendarOptions"/>
      </div>

      <div class="col column justify-center">
        <div class="q-col-gutter-y-md">
          <q-select square filled v-model="employee_name" label="Selecciona un empleado" :options="monitos" />
          <q-select square filled v-model="event_type" label="Tipo de evento" :options="types"/>
          <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />
          <q-input square filled v-model="end_date" :min="start_date" type="date" label="Fecha de fin" />
        </div>
        
        <div class="col-auto self-end">
          <q-btn class="q-mt-md" color="positive" label="Agendar" @click="add_event()" />
        </div>
        
      </div>
    </div>
  </q-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      //Calendar options
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        events: [],
        height: "auto",
        contentHeight: "auto",
      },

      //Global variables
      types: [
        'Permiso sin goce', 
        'Vacaciones', 
        'Descanso', 
        'Domingo laborado', 
        'Falta'
      ],
      monitos:[
        'Juan Carlos',
        'Joss',
        'Manuel'
      ],
      current_date : new Date().getFullYear() + "-" +(new Date().getMonth()+1)+ "-" + new Date().getDate(),

      //Model variables
      event_type: null,
      end_date: null,
      employee_name: null,
      start_date: null,
    }
  },
  methods: {
    add_event() {
      if (this.event_type && this.start_date && this.end_date && this.employee_name) {
        let d = new Date(this.end_date)
        d.setDate(d.getDate() + 2)
        let end = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()

        this.calendarOptions.events.push(
        {'title': this.employee_name, 
          'start': this.start_date, 
          'end': end,
          'color': get_color(this.event_type), 
          'editable': false,
          'calendar_id': 'Holi'})
      }
    }
    
  },
  setup () {
    return { 
    }
  },
}

function get_color(type){
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