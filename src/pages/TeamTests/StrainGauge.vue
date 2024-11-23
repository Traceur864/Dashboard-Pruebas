<template>
    <q-page>
      <div class="text-h4 text-center q-py-md">
        Calendario de Strain Gauge
      </div>
  
      <div class="row q-px-sm q-col-gutter-x-sm">
        <div class="col-7">
          <FullCalendar :options="calendarOptions"/>
        </div>
  
        <div class="col column justify-center">
          <div class="col-auto self-end q-pb-lg">
            <q-btn class="q-mt-md q-mx-sm" color="secondary" label="Administrar Testers" @click="this.testerForm = true"/>
            <q-btn class="q-mt-md" color="secondary" label="Administrar Fixturas" @click="showAlert()" />
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

            <q-select square filled v-model="fixture_sn" label="SN del tester" :options="fixture_serialnumbers"/>
            <q-select square filled v-model="fixture_id" label="ID de la fixtura" :options="fixture_ids"/>
            <q-input square filled v-model="start_date" :min="current_date" type="date" label="Fecha de inicio" />
            
            <div class="row q-col-gutter-x-sm">
                <div class="col">
                    <q-select square filled v-model="shift" label="Turno" :options="['Turno 1', 'Turno 2', 'Turno 3']"/>
                </div>
                <div class="col">
                    <q-select square filled v-model="asigned_to" label="Responsable de SG" :options="monitos"/>
                </div>
            </div>
            
          </div>
          
          <div class="col-auto self-end">
            <q-btn class="q-mt-md" color="positive" label="Agendar mantenimiento nuevo" @click="add_event()" />
          </div>
          
        </div>
      </div>
      <!-- ==================== DIALOGS ==================== -->
      <InsertTesterForm v-model="testerForm" />
    </q-page>
  </template>
  
  <script>
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'

  //Enable Api requests
  import {api} from 'boot/axios'
  
  //Importing components
  import InsertTesterForm from './Components/StrainGauge/Tester/TesterDialog.vue'
  
  export default {
    components: {
      FullCalendar, // make the <FullCalendar> tag available
      InsertTesterForm, 
    },
    data() {
      return {
        //Calendar options
        calendarOptions: {
          plugins: [ dayGridPlugin, interactionPlugin],
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
        fixture_serialnumbers: [
          'ICT231023-1','ICT231004-2',
          'ICT231004-3', 'BU3-F13082',
          'BU3-F13078', 'BU3-F13084',
        ],
        
        fixture_ids:[
        'PG520-B03-GW01', 'PG520-B03-GW02', 
        'PG520-B03-GW03', 'P2312-A04-GW01', 
        'P2312-A04-GW02', 'P2312-A04-GW03',
        '25612-B00-GB01', '25612-B00-GB03',
        '25612-B00-GB05'
        ],

        areas:[],

        monitos: [
            "Juan Carlos",
            'Miguelito',
            'Joss',
            'Raúl'
        ],

        current_date : new Date().getFullYear() + "-" +(new Date().getMonth()+1)+ "-" + new Date().getDate(),
  
        //Model variables
        area: null,
        fixture_sn: null,
        fixture_id: null,
        start_date: null,
        shift: null,
        modelo: null,
        asigned_to: null,
        testerForm: false,
        models: null,
      }
    },
    //Get functionalities from imported component
    mixins: [InsertTesterForm],
    //Functions inside component
    methods: {
        add_event() {
            if (this.area && this.fixture_sn && this.fixture_id && this.fixture_id &&
                this.start_date && this.shift && this.asigned_to) {
                let d = new Date(this.end_date)
                d.setDate(d.getDate() + 2)
                let end = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
  
                this.calendarOptions.events.push(
                {'title': this.area + this.fixture_id,
                    'start': this.start_date,
                    'end': this.start_date,
                    'color': "#433DE3",
                    'editable': false,
                    'calendar_id': 'Holi'})
                    
                this.clear_fields()
        }
      },

      loadData() {
        api.get('/model').then((response) =>{
          var data = response.data
          this.models = []
          for (const ele in data) {
            this.models.push({
              value: data[ele].ID_MODEL,
              label: data[ele].MODEL
            })
          }
        }).catch((err)=>{
          console.error(err);
        })

        api.get('/area').then((response) =>{
          var data = response.data
          this.areas = []
          for (const ele in data) {
            this.areas.push({
              value: data[ele].ID_AREA,
              label: data[ele].AREA
            })
          }
        }).catch((err)=>{
          console.error(err);
        })
      },

      clear_fields(){
        this.area = ""
        this.fixture_sn = ""
        this.fixture_id = ""
        this.start_date = ""
        this.shift = ""
        this.asigned_to = ""
      },
      
    },
    setup () {
      return {
      }
    },
    mounted(){
      this.loadData()

    }
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