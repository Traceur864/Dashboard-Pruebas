<template>
    <q-dialog :model-value="event_dialog" persistent>
        <q-card style="width: 80vw; max-width: 80vw; max-height: 80vh;">
            <q-card-section>
                <div class="text-h4">
                    Información de Strain Gauge #{{ event_id }}
                    <q-badge class="text-h6" :color="color" :label="status" />
                </div>
            </q-card-section>

            <q-card-section>
                <div class="row q-col-gutter-x-sm">
                    <div class="col">
                        <q-select ref="tester_select" square v-model="tester_sn" label="SN del Tester"
                            :options="tester_serialnumbers" @filter="filterTest" use-input input-debounce="0" />
                    </div>
                    <div class="col">
                        <q-select ref="fixture_select" square v-model="fixture_id" label="ID Fixtura"
                            :options="fixture_ids" @filter="filterFix" use-input input-debounce="0" />
                    </div>
                    <div class="col">
                        <q-input v-model="start_date" type="date" label="Fecha planeada para SG" />
                    </div>
                    <div class="col">
                        <q-select v-model="shift" :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" square />
                    </div>
                </div>

                <div class="row q-col-gutter-x-sm">
                    <div class="col-3">
                        <q-input v-model="original_date" type="date" readonly label="Fecha inicial de SG" />
                    </div>
                    <div class="col-3">
                        <q-input v-model="area" type="text" readonly label="Area" />
                    </div>
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
                </q-card-section>
            </div>

            <div v-if="finish_date != null">
                <q-card-section>
                    <div class="row text-h6">
                        Finalización
                    </div>
                </q-card-section>
            </div>

            <q-card-actions align="right" class="vertical-bottom">
                <q-btn color="negative" label="Cancelar" />
                <q-btn color="positive" label="Modificar" />
                <q-btn flat label="Cerrar" color="dark" @click="event_dialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    setup() {

    },
    data() {
        return {
            event_dialog: false,
            event_data: '',
            event_id: '',
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
            shift: '',
            start_date: '',
            status: '',
            tester_sn: '',
            updated_by: '',
            updated_comments: '',

            fixture_ids: [],
            fixtures: [],
            testers: [],
            tester_serialnumbers: [],
            color: '',
        }
    },
    methods: {
        openDialog(id) {
            this.event_dialog = true;
            this.loadData()
            this.getData(id)
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
        getData(id) {
            this.event_id = id;
            api.get('/strain_gauge/' + this.event_id).then((response) => {
                var data = response.data[0];
                this.area = data.AREA;
                this.asigned_to = data.ASIGNED_TO;
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
                this.shift = data.SHIFT;
                this.start_date = data.START_DATE.substring(0, 10);

                this.status = data.STATUS_SG;
                this.color = getColor(this.status);

                this.tester_sn = this.tester_serialnumbers.find(
                    (i) => i.value == data.ID_TESTER
                )

                this.updated_by = data.UPDATED_BY;
                this.updated_comments = data.UPDATED_COMMENTS;
            }).catch((error) => {
                console.error(error);
            })
        }
    },
    mounted() {

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
</script>