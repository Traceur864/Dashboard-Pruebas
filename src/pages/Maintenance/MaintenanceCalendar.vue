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
                        @click="this.$refs.historicMaintenance.openDialog()" />
                    <q-btn class="q-mt-md q-mx-xs" color="secondary" label="Testers"
                        @click="this.$refs.testerDialog.openDialog()" />
                    <q-btn class="q-mt-md q-mx-xs" color="secondary" label="Fixturas"
                        @click="this.$refs.fixtureDialog.openDialog()" />
                    <q-btn class="q-mt-md q-ml-xs" color="secondary" label="ATMs"
                        @click="this.$refs.atmDialog.openDialog()" />
                </div>
                <div class="q-col-gutter-y-md">

                    <q-select square filled v-model="tester_sn" label="SN Tester" :options="tester_serialnumbers"
                        @filter="filterTest" use-input input-debounce="0" />

                    <div class="row q-col-gutter-x-sm">
                        <div class="col">
                            <q-select square filled v-model="fixture_id" label="ID Fixtura" :options="fixtures_sns"
                                @filter="filterFix" use-input input-debounce="0" />
                        </div>
                        <div class="col">
                            <q-select square filled v-model="atm_sn" label="SN ATM" :options="atm_sns"
                                @filter="filterATM" use-input input-debounce="0" />
                        </div>
                    </div>

                    <q-input square filled v-model="start_date" type="date" label="Fecha limite" />

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
        <MaintenanceDialog ref="maintenanceDialog" @reload="reload" />
        <MaintenanceFinish ref="maintenanceFinishDialog" />
        <HistoricMaintenance ref="historicMaintenance" />

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
import MaintenanceDialog from './components/maintenance/maintenanceDialog.vue'
import MaintenanceFinish from './components/maintenance/maintenanceFinish.vue'
import HistoricMaintenance from './components/historicMaintenance.vue'

//Importing components
export default {
    components: {
        FullCalendar, // make the <FullCalendar> tag available
        TesterDialog,
        FixtureDialog,
        AtmDialog,
        MaintenanceDialog,
        MaintenanceFinish,
        HistoricMaintenance,
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
                    this.$refs.maintenanceDialog.openDialog(event.event.extendedProps.calendar_id);
                }
            },

            //Global variables
            tester_serialnumbers: [],
            testers: [],
            atm_sns: [],
            atms: [],
            fixtures_sns: [],
            fixtures: [],
            event_tps: ['Calibración', 'Mantenimiento'],
            current_date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),

            //Model variables
            tester_sn: null,
            start_date: null,
            event_type: null,
            fixture_id: null,
            atm_sn: null,
            calendar_id: null,
        }
    },
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
                    this.fixtures_sns = this.fixtures
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                this.fixtures_sns = this.fixtures.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
            })
        },
        filterATM(val, update, abort) {
            if (val === '') {
                update(() => {
                    this.atm_sns = this.atms
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                this.atm_sns = this.atm_sns.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
            })
        },
        eventInfo(info) {
            this.$refs.eventDialog.openDialog(info.event.extendedProps.calendar_id);
        },
        reload() {
            this.loadData()
            this.get_events()
        },
        add_event() {
            if (this.tester_sn || this.fixture_id || this.atm_sn) {
                if (this.event_type == "Calibración") {
                    //Send notification that fixtures can not be calibrated
                    if (this.fixture_id != null) {
                        this.$q.notify({
                            type: 'negative',
                            message: "No se realizan calibraciones a Fixturas",
                            position: "right",
                            timeout: 1200
                        })
                        return
                    }

                    //Show notification with TESTER
                    if (this.tester_sn != null) {
                        this.atmConfirmation()
                        return
                    }

                    //Submit calibration with ATM ID
                    this.submitCalibration()

                } else {
                    //Submit maintenance
                    this.submitMaintenance()
                }
            } else {
                this.$q.notify({
                    type: 'negative',
                    message: "Selecciona el equipo al que se le hará el mantenimiento / calibración",
                    position: "right",
                    timeout: 1200
                })
            }
        },
        submitMaintenance() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()

            if (this.atm_sn != null) {
                params.append('atm_sn', this.atm_sn.value)
            } else {
                params.append('atm_sn', null)
            }

            if (this.fixture_id != null) {
                params.append('fixture_id', this.fixture_id.value)
            } else {
                params.append('fixture_id', null)
            }

            if (this.tester_sn != null) {
                params.append('tester_sn', this.tester_sn.value)
            } else {
                params.append('tester_sn', null)
            }

            params.append('start_date', this.start_date)
            params.append('event_type', this.event_type)
            params.append('created_by', 1)
            //TODO: GET USER ID FROM LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.post('/maintenance', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: "positive",
                    message: response.data,
                    position: 'top'
                })

                this.clear_fields()
                this.get_events()

            }).catch((error) => {

                var errors = error.response.data.error
                console.error(errors);

                errors.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        submitCalibration() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()

            if (this.atm_sn != null) {
                params.append('id_atm', this.atm_sn.value)
            } else {
                params.append('id_atm', null)
            }

            if (this.tester_sn != null) {
                params.append('id_tester', this.tester_sn.value)
            } else {
                params.append('id_tester', null)
            }

            params.append('start_date', this.start_date)
            params.append('event_type', this.event_type)
            params.append('created_by', 1)
            //TODO: GET USER ID FROM LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.post('/calibration/', params, config).then((response) => {
                dismiss()
                console.log(response.data);

                this.$q.notify({
                    type: "positive",
                    message: response.data,
                    position: 'top'
                })
                this.clear_fields()
                this.get_events()
            }).catch((error) => {

                var errors = error.response.data.error
                console.error(error);

                errors.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        atmConfirmation() {

            api.get('/atm/tester/' + this.tester_sn.value).then((response) => {
                var data = response.data[0]

                this.$q.dialog({
                    title: 'Confirmación',
                    message: 'El ATM a calibrar es: ' + data.ATM_SN,
                    ok: {
                        label: 'Confirmar',
                        color: 'positive',
                    },
                    cancel: {
                        label: 'Cancelar',
                        color: 'negative',
                    },
                }).onOk(() => {
                    this.submitCalibration()
                })

            }).catch((err) => {
                var errors = err.response.data.error
                console.error(err);

                errors.forEach(erro => {
                    this.$q.notify({
                        type: 'negative',
                        message: erro.msg,
                        position: "right",
                        timeout: 1200,
                    })
                });
            })

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

            api.get('/atm/active').then((response) => {
                var data = response.data
                this.atm_sns = []
                data.forEach(ele => {
                    this.atm_sns.push({
                        value: ele.ID_ATM,
                        label: ele.ATM_SN
                    })
                });
                this.atms = this.atm_sns
            }).catch((err) => {
                console.error(err);
            })

            api.get('/fixture/active').then((response) => {
                var data = response.data
                this.fixtures_sns = []
                data.forEach(ele => {
                    this.fixtures_sns.push({
                        value: ele.ID_FIXTURE,
                        label: ele.FIXTURE_ID
                    })
                });
                this.fixtures = this.fixtures_sns
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
        },

        get_events() {
            this.calendarOptions.events = []

            api.get('/maintenance').then((response) => {
                var data = response.data
                data.forEach(el => {
                    var name = ""

                    if (el.FIXTURE_ID != null) {
                        name = el.FIXTURE_ID
                    } else if (el.TESTER_SN != null) {
                        name = el.TESTER_SN
                    } else if (el.ATM_SN != null) {
                        name = el.ATM_SN
                    }

                    this.calendarOptions.events.push(
                        {
                            'title': el.EVENT_TYPE + ", Fixtura:" + name,
                            'start': el.PLAN_DATE.substring(0, 10),
                            'end': el.PLAN_DATE.substring(0, 10),
                            'color': getColor(setStatus(el.STATUS_M, el.EVENT_TYPE, el.PLAN_DATE)),
                            'editable': false,
                            'calendar_id': el.ID_MAINTENANCE
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
            this.atm_sn = ""
            this.start_date = ""
            this.shift = ""
            this.asigned_to = ""
            this.event_type = ""
        },

    },
    setup() {
        return {
        }
    },
    mounted() {
        let self = this
        this.loadData()
        this.get_events()
    },
    watch: {
        tester_sn: function () {
            if (this.tester_sn != null) {
                this.fixture_id = null
                this.atm_sn = null
            }
        },
        fixture_id: function () {
            if (this.fixture_id != null) {
                this.tester_sn = null
                this.atm_sn = null
            }
        },
        atm_sn: function () {
            if (this.atm_sn != null) {
                this.fixture_id = null
                this.tester_sn = null
            }
        }
    }
}

function getColor(status) {
    switch (status) {
        case 'En proceso':
            return '#9C27B0'
        case 'Por expirar':
            return '#F2C037'
        case 'Fallido':
            return '#C10015'
        case 'Asignado':
            return '#1976D2'
        case 'Atrasado':
            return '#FF5722'
        case 'Finalizado':
            return '#21BA45'
        default:
            return '#000000'
    }
}

function setStatus(status, event_type, plan_date) {
    if (event_type == 'Mantenimiento') {
        switch (status) {
            case 'En proceso':
                return 'En proceso'
            case 'Finalizado':
                return 'Finalizado'
            case 'Asignado':
                var date = new Date(plan_date)
                var today = new Date(new Date().toDateString())
                var btw = days_between(today, date)

                if (btw < 8 && btw > 0) {
                    return 'Atrasado'
                } else if (btw <= 0) {
                    return 'Fallido'
                } else {
                    return 'Asignado'
                }
        }
    } else {
        switch (status) {
            case 'En proceso':
                return 'En proceso'
            case 'Finalizado':
                return 'Finalizado'
            case 'Asignado':
                var date = new Date(plan_date)
                var today = new Date(new Date().toDateString())
                var btw = days_between(today, date)

                if (btw < 46 && btw > 7) {
                    return 'Atrasado'
                } else if (btw <= 6) {
                    return 'Fallido'
                } else {
                    return 'Asignado'
                }
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