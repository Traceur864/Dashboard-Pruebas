<template>
    <q-page>
        <div class="text-h4 text-center q-py-md">
            Mantenimientos y calibraciones
        </div>

        <div class="row q-px-sm q-col-gutter-x-sm">
            <div class="col-7">
                <FullCalendar :options="calendarOptions" />
            </div>

            <div class="col column justify-center">
                <div class="col-auto self-end q-pb-lg">
                    <div class="text-h6">Guía de colores</div>
                    <div class="col">
                        <q-badge color="purple" class="q-mx-xs" label="En proceso"></q-badge>

                        <q-badge color="negative" class="q-mx-xs" label="Fallido">
                            <q-tooltip class="text-caption">El mantenimiento / calibración no se realizó a
                                tiempo</q-tooltip>
                        </q-badge>

                        <q-badge color="primary" class="q-mx-xs" label="Asignado">
                            <q-tooltip class="text-caption">Más de 45 días para la calibración / Más de 3 semanas para
                                el mantenimiento</q-tooltip>
                        </q-badge>

                        <q-badge color="deep-orange" class="q-mx-xs" label="Atrasado">
                            <q-tooltip class="text-caption">La calibración se encuentra a menos de 45 días para su
                                vencimiento / El mantenimiento se encuentra a menos de 1 semana para su vencimiento
                            </q-tooltip>
                        </q-badge>

                        <q-badge color="positive" class="q-mx-xs" label="Finalizado">
                            <q-tooltip class="text-caption">El Mantenimiento / Calibración se realizó
                                exitosamente</q-tooltip>
                        </q-badge>

                        <q-badge color="dark" text-color="white" label="Cancelado">
                            <q-tooltip class="text-caption">El Mantenimiento / Calibración ha finalizado</q-tooltip>
                        </q-badge>
                    </div>
                </div>
                <div class="col-auto self-end q-pb-lg">
                    <q-btn class="q-mt-md q-mx-xs" color="secondary" label="Historial"
                        @click="this.$refs.showEvents.openDialog()" />
                    <q-btn class="q-mt-md q-mx-xs" color="secondary" label="Testers"
                        @click="this.$refs.testerDialog.openDialog()" />
                    <q-btn class="q-mt-md q-mx-xs" color="secondary" label="Fixturas"
                        @click="this.$refs.fixtureDialog.openDialog()" />
                    <q-btn class="q-mt-md q-ml-xs" color="secondary" label="ATMs"
                        @click="this.$refs.atmDialog.openDialog()" />
                </div>
                <div class="q-col-gutter-y-md">

                    <q-select ref="tester_select" square filled v-model="tester_sn" label="SN del tester"
                        :options="tester_serialnumbers" @filter="filterTest" use-input input-debounce="0" />

                    <q-input square filled v-model="start_date" type="date" label="Fecha de inicio" />

                    <q-select v-model="event_type" :options="event_tps" label="Tipo de evento" square filled />
                </div>

                <div class="col-auto self-end">
                    <q-btn class="q-mt-md" color="positive" label="Agendar mantenimiento" @click="add_event()" />
                </div>

            </div>
        </div>
        <!-- ==================== DIALOGS ==================== -->
        <TesterDialog ref="testerDialog" @reload="reload" />
        <FixtureDialog ref="fixtureDialog" @reload="reload" />
        <AtmDialog ref="atmDialog" @reload="reload" />
    </q-page>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

//Enable Api requests
import { api } from 'boot/axios'
import TesterDialog from '../TeamTests/Components/StrainGauge/Tester/TesterDialog.vue'
import FixtureDialog from '../TeamTests/Components/StrainGauge/Fixture/FixtureDialog.vue'
import AtmDialog from '../TeamTests/Components/StrainGauge/Atm/AtmDialog.vue'

//Importing components
export default {
    components: {
        FullCalendar, // make the <FullCalendar> tag available
        TesterDialog,
        FixtureDialog,
        AtmDialog,
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
            event_tps: ['Calibración', 'Mantenimiento', 'Cambio de tarjeta'],
            current_date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),

            //Model variables
            tester_sn: null,
            start_date: null,
            event_type: null,
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
            if (this.tester_sn && this.start_date && this.event_type) {
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
                //TODO: GET USER ID FROM LOCAL STORAGE
                //

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

                }).catch((error) => {

                    var error = err.response.data.error
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