<template>
    <q-card-section>
        <div class="text-h4">
            Strain Gauge #{{ event_id }}
            <q-badge class="text-h6" :color="color" :label="status" />
        </div>
    </q-card-section>

    <q-card-section>
        <div class="row text-h6">
            Información general
        </div>
        <div class="row q-col-gutter-x-sm">
            <div class="col">
                <q-select ref="tester_select" readonly square v-model="tester_sn" label="SN del Tester"
                    :options="tester_serialnumbers" />
            </div>
            <div class="col">
                <q-select ref="fixture_select" readonly square v-model="fixture_id" label="ID Fixtura"
                    :options="fixture_ids" />
            </div>
            <div class="col">
                <q-input v-model="start_date" readonly :min="original_date" :max="limit_date" type="date"
                    label="Fecha planeada para SG" />
            </div>
            <div class="col">
                <q-select v-model="shift" readonly :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" square />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm">
            <div class="col">
                <q-input type="text" readonly :model-value="asigned_to" label="Responsable SG" />
            </div>
            <div class="col">
                <q-input v-model="original_date" type="date" readonly label="Fecha inicial de SG" />
            </div>
            <div class="col">
                <q-input v-model="limit_date" type="date" readonly label="Fecha limite" />
            </div>
            <div class="col">
                <q-input v-model="area" type="text" readonly label="Area" />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm">
            <div class="col-3">
                <q-input v-model="model" type="text" readonly label="Modelo" />
            </div>
        </div>
    </q-card-section>

    <div v-if="updated_by != null">
        <q-card-section>
            <div class="row text-h6">
                Cambios
            </div>
            <div class="row q-col-gutter-x-sm">
                <div class="col-3">
                    <q-input v-model="updated_by" readonly type="text" label="Actualizado por" />
                </div>
                <div class="col-3">
                    <q-input v-model="updated_at" readonly type="text" label="Actualizado a las" />
                </div>
            </div>
            <div v-if="status == 'Cancelado'" class="row q-col-gutter-x-sm">
                <div class="col">
                    <q-input v-model="finish_comments" readonly type="text" label="Comentarios de cancelación" />
                </div>
            </div>
            <div v-else class="row q-col-gutter-x-sm">
                <div class="col">
                    <q-input v-model="updated_comments" readonly type="text" label="Comentarios de cambio" />
                </div>
            </div>
        </q-card-section>
    </div>

    <div v-if="finish_date != null">
        <q-card-section>
            <div class="row text-h6">
                Finalización
            </div>

            <div class="row q-col-gutter-x-sm">
                <div class="col-3">
                    <q-input v-model="finish_date" readonly type="date" label="Finalizado el" />
                </div>
                <div class="col">
                    <q-input v-model="finish_comments" type="text" readonly label="Comentarios" />
                </div>
            </div>
        </q-card-section>
    </div>

    <q-card-section align="right" class="vertical-bottom">
        <q-btn v-if="status != 'Finalizado' && status != 'En proceso' && status != 'Cancelado'" color="purple"
            class="q-mx-sm" label="Comenzar" @click="this.$refs.startDialog.openDialog()" />
        <q-btn v-if="status == 'En proceso'" color="positive" class="q-mx-sm" label="Finalizar"
            @click="this.$refs.finishDialog.openDialog()" />
    </q-card-section>

    <StartDialog :event_id="event_id" ref="startDialog" @reload="reload" />
    <FinishDialog :event_id="event_id" ref="finishDialog" @reload="reload" />

</template>

<script>
import { api } from 'boot/axios'
import StartDialog from './StartDialog.vue'
import FinishDialog from './FinishDialog.vue'

export default {
    setup(props) {
        return {
            props
        }
    },
    props: ['event_id'],
    emits: ['reload'],
    components: {
        StartDialog,
        FinishDialog
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
            updated_by: '',
            updated_comments: '',
            updated_at: '',

            fixture_ids: [],
            fixtures: [],
            testers: [],
            tester_serialnumbers: [],
            color: '',
        }
    },
    methods: {
        reload() {
            this.getData()
            this.$emit('reload')
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
                this.area = data.AREA_SG;
                this.asigned_to = data.ASIGNED_TO
                this.created_at = data.CREATED_AT.substring(0, 10);
                this.created_by = data.CREATED_BY;
                this.finish_comments = data.FINISH_COMMENTS;
                this.asigned_to = data.ASIGNED_NAME + " " + data.ASIGNED_LASTNAME

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
                this.start_date = data.START_DATE.substring(0, 10);
                this.original_date = data.ORIGINAL_DATE.substring(0, 10);
                var date = new Date(data.ORIGINAL_DATE)
                date.setDate(date.getDate() + 6)
                this.limit_date = date.toISOString().substring(0, 10);

                this.shift = data.SHIFT;
                this.updated_at = new Date(data.UPDATED_AT).toLocaleString()

                this.status = setStatus(data.STATUS_SG, data.START_DATE)
                this.color = getColor(this.status);

                this.tester_sn = this.tester_serialnumbers.find(
                    (i) => i.value == data.ID_TESTER
                )

                // this.updated_by = data.UPDATED_BY;
                this.updated_by = data.UPDATED_BY;
                if (data.UPDATED_BY != null) {
                    this.updated_by = "Isela";
                }
                this.updated_comments = data.UPDATED_COMMENTS;
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
        case 'Asignado':
            var date = new Date(start_date)
            var today = new Date(new Date().toDateString())
            var btw = days_between(today, date)

            if (btw < 3 && btw > 0) {
                return 'Atrasado'
            } else if (btw <= 0) {
                return 'Fallido'
            }
        default:
            return status
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