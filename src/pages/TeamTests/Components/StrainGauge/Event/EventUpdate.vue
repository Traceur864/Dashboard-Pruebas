<template>
    <q-card-section>
        <div class="row text-h6">
            Información general
        </div>
        <div class="row q-col-gutter-x-sm">
            <div class="col">
                <q-select ref="tester_select" square v-model="tester_sn" label="SN del Tester"
                    :options="tester_serialnumbers" @filter="filterTest" use-input input-debounce="0" />
            </div>
            <div class="col">
                <q-select ref="fixture_select" square v-model="fixture_id" label="ID Fixtura" :options="fixture_ids"
                    @filter="filterFix" use-input input-debounce="0" />
            </div>
            <div class="col">
                <q-input v-model="start_date" :min="original_date" :max="limit_date" type="date"
                    label="Fecha planeada para SG" />
            </div>
            <div class="col">
                <q-select v-model="shift" :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" square />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm">
            <div class="col-3">
                <q-select v-model="asigned_to" label="Responsable de SG"
                    :options="['Juan Carlos', 'Miguelito', 'Isela', 'Joss', 'Raúl']" />
            </div>
            <div class="col">
                <q-input v-model="comments" type="text" label="Comentarios"
                    hint="Breve explicación de porque se realizó el cambio" />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm">
            <div class="col">
                <q-input v-model="original_date" type="date" readonly label="Fecha inicial de SG" />
            </div>
            <div class="col">
                <q-input v-model="limit_date" type="date" readonly label="Fecha limite" />
            </div>
            <div class="col">
                <q-input v-model="area" type="text" readonly label="Area" />
            </div>
            <div class="col">
                <q-input v-model="model" type="text" readonly label="Modelo" />
            </div>
        </div>
    </q-card-section>

    <q-card-section align="right" class="vertical-bottom">
        <q-btn color="dark" class="q-mx-xs" label="Cancelar" @click="this.$refs.cancelDialog.openDialog()" />
        <q-btn color="positive" class="q-mx-xs" label="Modificar" @click="updateEvent" />
    </q-card-section>

    <CancelDialog :event_id="event_id" @move="this.$emit('move')" @reload="getData" ref="cancelDialog" />
</template>

<script>
import { api } from 'boot/axios'
import CancelDialog from './CancelDialog.vue'

export default {
    setup(props) {
        return {
            props
        }
    },
    props: ['event_id'],
    emits: ['reload', 'move'],
    components: {
        CancelDialog
    },
    data() {
        return {
            event_dialog: false,
            event_data: '',
            area: '',
            asigned_to: '',
            created_at: '',
            created_by: '',
            finish_comments: '',
            finish_date: '',
            fixture_id: '',
            made_by: '',
            model: '',
            original_date: '',
            limit_date: '',
            shift: '',
            start_date: '',
            status: '',
            tester_sn: '',
            updated_comments: '',

            fixture_ids: [],
            fixtures: [],
            testers: [],
            tester_serialnumbers: [],
            color: '',

            comments: '',
            updated_by: '',
        }
    },
    methods: {
        updateEvent() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('event_id', this.props.event_id)
            params.append('tester_id', this.tester_sn.value)
            params.append('fixture_id', this.fixture_id.value)
            params.append('start_date', this.start_date)
            params.append('shift', this.shift)
            params.append('comments', this.comments)
            //UPDATE these lines to take USER_ID from local storage when USER DB is done
            params.append('updated_by', 1)
            params.append('asigned_to', 1)
            // params.append('updated_by', this.updated_by)
            // params.append('asigned_to', this.asigned_to)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/strain_gauge/', params, config).then((response) => {
                dismiss()
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })
                this.getData()
                this.event_dialog = false
                this.$emit('reload')
            }).catch((error) => {
                dismiss()

                try {
                    var errors = error.response.data.error
                } catch (err) {
                    console.error(err);
                    console.error(error);
                }

                console.error(errors);

                errors.forEach(ele => {
                    this.$q.notify({
                        type: 'negative',
                        message: ele.msg,
                        position: "top"
                    })
                });
            })
        },
        reload() {
            this.$emit('reload')
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
        },
        getData() {
            api.get('/strain_gauge/' + this.event_id).then((response) => {
                var data = response.data[0];
                this.area = data.AREA;
                // this.asigned_to = data.ASIGNED_TO;
                this.asigned_to = "Isela"
                this.created_at = data.CREATED_AT.substring(0, 10);
                this.created_by = data.CREATED_BY;
                this.finish_comments = data.FINISH_COMMENTS;

                if (data.FINISH_DATE != null) {
                    this.finish_date = data.FINISH_DATE.substring(0, 10);
                } else {
                    this.finish_date = data.FINISH_DATE
                }

                this.fixture_id = this.fixture_ids.find(
                    (i) => i.value == data.ID_FIXTURE
                )

                this.made_by = data.MADE_BY;
                this.model = data.MODEL;
                this.original_date = data.ORIGINAL_DATE.substring(0, 10);
                var date = new Date(data.ORIGINAL_DATE)
                date.setDate(date.getDate() + 6)
                this.limit_date = date.toISOString().substring(0, 10);

                this.shift = data.SHIFT;
                this.start_date = data.START_DATE.substring(0, 10);

                this.status = setStatus(data.STATUS_SG, data.START_DATE)
                this.color = getColor(this.status);

                this.tester_sn = this.tester_serialnumbers.find(
                    (i) => i.value == data.ID_TESTER
                )

                this.$emit('reload')
            }).catch((error) => {
                console.error(error);
            })
        }
    },
    mounted() {
        this.loadData()
        this.getData()
    }
}

function getColor(status) {
    switch (status) {
        case 'En proceso':
            return 'purple'
        case 'Por expirar':
            return 'warning'
        case 'Fallido':
            return 'negative'
        case 'Asignado':
            return 'primary'
        case 'Atrasado':
            return 'deep-orange'
        case 'Finalizado':
            return 'positive'
        default:
            return 'dark'
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
                return 'Por expirar'
            } else if (btw <= 0) {
                return 'Fallido'
            }
    }
}

function days_between(date1, date2) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
}
</script>