<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

export default {
  setup () {  
    return {
      event_type: ref(null),
      types: [
        'Permiso sin goce', 
        'Vacaciones', 
        'Descanso', 
        'Domingo laborado', 
        'Falta'
      ],
      employee_name: ref(null),
      start_date: ref(null),
      end_date: ref(null),

      current_date : new Date().getFullYear() + "-" +(new Date().getMonth()+1)+ "-" + new Date().getDate()
    }
  },
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        events: [],
        height: "auto",
        contentHeight: "auto",
      }
    }
  },
}


</script>

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
        <div class="q-col-gutter-y-md">
          <q-select square filled v-model="employee_name" label="Selecciona un empleado" />
          <q-select square filled v-model="event_type" label="Tipo de evento" :options="types"/>
          <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />
          <q-input square filled v-model="end_date" :min="start_date" type="date" label="Fecha de fin" />
        </div>
        
        <div class="col-auto self-end">
          <q-btn class="q-mt-md" color="positive" label="Agendar" />
        </div>
        
      </div>
    </div>
  </q-page>
</template>