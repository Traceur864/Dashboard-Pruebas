<template>
    <q-card-section>
        <div class="text-h6 q-pb-md">
            Información del mantenimiento <span style="text-decoration: underline;">#{{ id_maintenance }}</span>
            <q-badge class="q-ml-md" :color="getColor(status)" :label="status" />
        </div>

        <div class="row q-col-gutter-x-sm q-pb-sm">
            <div class="col">
                <q-select v-model="tester_sn" :options="tester_serialnumbers" label="SN Tester" square
                    @filter="filterTest" use-input input-debounce="0" :readonly="disabled" />
            </div>
            <div class="col">
                <q-select v-model="fixture_sn" :options="fixtures_sns" label="ID Fixtura" square @filter="filterFix"
                    use-input input-debounce="0" :readonly="disabled" />
            </div>
            <div class="col">
                <q-select v-model="atm_sn" :options="atm_sns" label="SN ATM" square @filter="filterATM" use-input
                    input-debounce="0" :readonly="disabled" />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm q-py-sm">
            <div class="col">
                <q-select v-model="event_type" :options="event_tps" label="Tipo de evento" square
                    :readonly="disabled" />
            </div>
            <div class="col">
                <q-input v-model="start_date" type="date" :max="limit_date" label="Fecha de inicio" square
                    :readonly="disabled" />
            </div>
        </div>

        <div v-if="status == 'Finalizado'">
            <div class="text-h6 q-py-sm">
                Comentarios de finalización
            </div>

            <div class="row">
                <div class="col">
                    <q-input readonly v-model="comments" type="textarea" rows="2" label="Comentarios de finalización" />
                </div>
            </div>

            <div class="row q-col-gutter-x-sm">
                <div class="col">
                    <q-input readonly v-model="finished_by" type="text" label="Finalizado por" />
                </div>
                <div class="col">
                    <q-input readonly v-model="finish_date" type="text" label="Fecha de finalización" />
                </div>
            </div>
        </div>

        <div v-if="status == 'Cancelado'">
            <div class="text-h6 q-py-sm">
                Comentarios de cancelación
            </div>

            <div class="row">
                <div class="col">
                    <q-input readonly v-model="comments" type="textarea" rows="2" label="Comentarios de cancelación" />
                </div>
            </div>

            <div class="row q-col-gutter-x-sm">
                <div class="col">
                    <q-input readonly v-model="finished_by" type="text" label="Cancelado por" />
                </div>
                <div class="col">
                    <q-input readonly v-model="finish_date" type="text" label="Fecha de cancelación" />
                </div>
            </div>
        </div>

    </q-card-section>

    <q-card-section v-if="updated_by != null">
        <div class="text-h6">
            Cambios realizados
        </div>
        <div class="row">
            <div class="col">
                <q-input readonly v-model="updated_comments" type="textarea" rows="2"
                    label="Comentarios de actualización" />
            </div>
        </div>
        <div class="row q-col-gutter-x-sm">
            <div class="col">
                <q-input v-model="updated_by" readonly type="text" label="Actualizado por" />
            </div>
            <div class="col">
                <q-input v-model="updated_at" readonly type="text" label="Fecha y hora de la actualización" />
            </div>
        </div>
    </q-card-section>

    <q-card-section class="q-pb-lg" v-if="status != 'Cancelado'">
        <div class="float-right">
            <q-btn v-if="status != 'En proceso' && status != 'Finalizado'" color="purple" label="Comenzar"
                @click="startMaintenance" />
            <q-btn v-if="status == 'En proceso'" color="positive" label="Finalizar"
                @click="this.$refs.finishDialog.openDialog()" />
        </div>
    </q-card-section>

    <q-card-section class="q-pt-lg">
        <div class="float-right" v-if="status != 'Finalizado' && status != 'Cancelado'">
            <q-btn color="negative" icon="delete" label="Cancelar" class="q-mx-sm" @click="cancelConfirmation()" />
            <q-btn color="positive" icon="edit" label="Modificar" @click="sendInfo()" />
        </div>
    </q-card-section>

    <MaintenanceFinish ref="finishDialog" :id_maintenance="id_maintenance" @reload="reload" />
    <UpdateDialog ref="updateDialog" @reload="reload" />

</template>

<script>
import { api } from 'boot/axios'
import MaintenanceFinish from './maintenanceFinish.vue'
import UpdateDialog from '../updateDialog.vue'

export default {
    components: {
        MaintenanceFinish,
        UpdateDialog
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
            tab: 'Modificar',
            disabled: false,
            limit_date: '',

            //Model variables
            tester_sn: null,
            fixture_sn: null,
            atm_sn: null,
            event_type: null,
            start_date: null,
            status: null,

            //Finish variables
            comments: null,
            finish_date: null,
            finished_by: null,

            //Update variables
            updated_comments: null,
            updated_by: null,
            updated_at: null,
        }
    },
    emits: ['reload'],
    props: ['id_maintenance'],
    methods: {
        reload() {
            this.$emit('reload')
            this.getData()
        },
        sendInfo() {

            if (this.event_type == 'Calibración' && this.fixture_sn != null) {
                this.$q.notify({
                    type: 'negative',
                    message: 'No se realizan calibraciones a Fixturas',
                    position: "center",
                    timeout: 1200
                })

                return
            }


            var data = {
                id_maintenance: this.id_maintenance,
                tester_sn: this.tester_sn,
                fixture_sn: this.fixture_sn,
                atm_sn: this.atm_sn,
                event_type: this.event_type,
                start_date: this.start_date
            }

            this.$refs.updateDialog.openDialog(data)
        },
        startMaintenance() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()

            params.append('id_maintenance', this.id_maintenance)
            //TODO: GET USER ID FROM LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/maintenance/start', params, config).then((response) => {
                dismiss()
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })
                this.getData()
                this.$emit('reload')
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
        cancelConfirmation() {
            this.$q.dialog({
                title: 'Confirmación',
                message: '¿Realmente quieres cancelar el mantenimiento?',
                ok: {
                    label: 'Cancealr',
                    color: 'negative',
                },
                cancel: {
                    label: 'Cerrar',
                    color: 'black',
                    flat: true,
                },
            }).onOk(() => {
                this.cancelMaintenance()
            })
        },
        cancelMaintenance() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_maintenance', this.id_maintenance)
            params.append('made_by', 1)
            // TODO: GET USER_ID FROM LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/maintenance/cancel', params, config).then((response) => {
                dismiss()
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })
                this.getData()
                this.$emit('reload')

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
        getData() {
            api.get('/maintenance/' + this.id_maintenance).then((response) => {
                var data = response.data[0]

                if (data.ID_ATM != null) {
                    this.atm_sn = this.atms.find(
                        (i) => i.value == data.ID_ATM
                    )

                } else {
                    this.atm_sn = null
                }

                if (data.ID_FIXTURE != null) {
                    this.fixture_sn = this.fixtures.find(
                        (i) => i.value == data.ID_FIXTURE
                    )
                } else {
                    this.fixture_sn = null
                }

                if (data.ID_TESTER != null) {
                    this.tester_sn = this.testers.find(
                        (i) => i.value == data.ID_TESTER
                    )
                } else {
                    this.tester_sn = null
                }

                if (data.STATUS_M == 'Finalizado' || data.STATUS_M == 'Cancelado') {
                    this.disabled = true
                } else {
                    this.disabled = false
                }
                this.status = setStatus(data.STATUS_M, data.EVENT_TYPE, data.PLAN_DATE)

                this.event_type = data.EVENT_TYPE
                this.start_date = data.PLAN_DATE.substring(0, 10)
                this.limit_date = data.PLAN_DATE.substring(0, 10)
                //Finished info
                if (data.FINISH_DATE != null) {
                    this.comments = data.COMMENTS
                    this.finish_date = data.FINISH_DATE.substring(0, 10)
                    this.finished_by = data.MADE_NAME
                } else {
                    this.comments = null
                    this.finish_date = null
                    this.finished_by = null
                }

                //Updated info
                if (data.UPDATED_BY != null) {
                    this.updated_at = data.UPDATED_AT.substring(0, 10) + " a las " + new Date(data.UPDATED_AT).toLocaleTimeString()
                    this.updated_comments = data.UPDATED_COMMENTS
                    this.updated_by = data.UPDATED_BY
                } else {
                    this.updated_comments = null
                    this.updated_by = null
                    this.updated_at = null
                }

            }).catch((error) => {
                console.error(error);
                this.$q.notify({
                    type: 'negative',
                    message: "Server error, error al obtener la información",
                    position: "top",
                    timeout: 1200
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
        getColor(status) {
            switch (status) {
                case 'En proceso':
                    return 'purple'
                case 'Fallido':
                    return 'negative'
                case 'Asignado':
                    return 'primary'
                case 'Atrasado':
                    return 'deep-orange'
                case 'Finalizado':
                    return 'positive'
                case 'Cancelado':
                    return 'black'
                default:
                    return 'black'
            }
        }
    },
    watch: {
        tester_sn: function () {
            if (this.tester_sn != null) {
                this.fixture_sn = null
                this.atm_sn = null
            }
        },
        fixture_sn: function () {
            if (this.fixture_sn != null) {
                this.tester_sn = null
                this.atm_sn = null
            }
        },
        atm_sn: function () {
            if (this.atm_sn != null) {
                this.fixture_sn = null
                this.tester_sn = null
            }
        }
    },
    mounted() {
        this.loadData()
        this.getData()
    }
}

function setStatus(status, event_type, plan_date) {
    if (event_type == 'Mantenimiento') {
        switch (status) {
            case 'En proceso':
                return 'En proceso'
            case 'Finalizado':
                return 'Finalizado'
            case 'Cancelado':
                return 'Cancelado'
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
            default:
                return status
        }
    } else {
        switch (status) {
            case 'En proceso':
                return 'En proceso'
            case 'Finalizado':
                return 'Finalizado'
            case 'Cancelado':
                return 'Cancelado'
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
            default:
                return status
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