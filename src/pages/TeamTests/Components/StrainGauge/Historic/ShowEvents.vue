<template>
    <q-dialog v-model="showEvents" persistent>
        <q-card style="width: 90vw; max-width: 90vw;">
            <q-card-section>
                <div class="text-h4 q-px-xs">
                    Historial de Strain Gauges
                </div>
            </q-card-section>
            <q-card-section class="row items-center">
                <q-grid title="Historial de Strain Gauges" :data="data" :columns="columns" row-key="name"
                    style="width: 100vw" :columns_filter="true">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td>
                                {{ props.row.ID_EVENT }}
                            </q-td>
                            <q-td>
                                {{ props.row.FIXTURE_ID }}
                            </q-td>
                            <q-td>
                                {{ props.row.TESTER_SN }}
                            </q-td>
                            <q-td>
                                {{ props.row.MODEL }}
                            </q-td>
                            <q-td>
                                {{ props.row.AREA }}
                            </q-td>
                            <q-td>
                                {{ props.row.START_DATE.substring(0, 10) }}
                            </q-td>
                            <q-td>
                                {{ props.row.FINISH_DATE }}
                            </q-td>
                            <q-td>
                                <q-badge :color="getColor(setStatus(props.row.STATUS_SG))"
                                    :label="setStatus(props.row.STATUS_SG)" />
                            </q-td>
                            <q-td>
                                <q-btn color="primary" icon="info" @click="openEvent(props.row.ID_EVENT)" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-grid>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="dark" @click="showEvents = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <EventDialog ref="eventDialog" @reload="reload" />
</template>

<script>
import { api } from 'boot/axios'
import EventDialog from '../Event/EventDialog.vue';

export default {
    setup() {

    },
    components: {
        EventDialog
    },
    emits: ['reload'],
    data() {
        return {
            showEvents: false,
            data: [],
            columns: [
                { name: 'id_event', field: 'ID_EVENT', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'fixture_id', field: 'FIXTURE_ID', required: true, label: 'ID Fixtura', align: 'center', sortable: true },
                { name: 'tester_sn', field: 'TESTER_SN', required: true, label: 'SN Tester', align: 'center', sortable: true },
                { name: 'model', field: 'MODEL', required: true, label: 'Modelo', align: 'center', sortable: true },
                { name: 'area', field: 'AREA', required: true, label: 'Area', align: 'center', sortable: true },
                { name: 'start_date', field: 'START_DATE', required: true, label: 'Fecha inicial', align: 'center', sortable: true },
                { name: 'finish_date', field: 'FINISH_DATE', required: true, label: 'Fecha de finalización', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS_SG', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center' },
            ],
        }
    },
    methods: {
        openDialog() {
            this.showEvents = true;
            this.getData()
        },
        openEvent(id) {
            this.$refs.eventDialog.openDialog(id)
        },
        reload() {
            this.getData()
            this.$emit('reload')
        },
        getData() {
            this.data = []

            api.get('/strain_gauge').then((response) => {
                response.data.forEach(dat => {
                    if (dat.FINISH_DATE != null) {
                        dat.FINISH_DATE = dat.FINISH_DATE.substring(0, 10)
                    } else {
                        dat.FINISH_DATE = 'N/A'
                    }
                    this.data.push({
                        ID_EVENT: dat.ID_EVENT,
                        FIXTURE_ID: dat.FIXTURE_ID,
                        TESTER_SN: dat.TESTER_SN,
                        MODEL: dat.MODEL,
                        AREA: dat.AREA,
                        START_DATE: dat.START_DATE,
                        FINISH_DATE: dat.FINISH_DATE,
                        STATUS_SG: dat.STATUS_SG,
                        btn: ''
                    })
                });
            }).catch((error) => {
                console.error(error);
            })
        },
        getColor(status) {
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
        },
        setStatus(status, start_date) {
            switch (status) {
                case 'Asignado':
                    var date = new Date(start_date)
                    var today = new Date(new Date().toDateString())
                    var btw = this.days_between(today, date)

                    if (btw < 3 && btw > 0) {
                        return 'Por expirar'
                    } else if (btw <= 0) {
                        return 'Fallido'
                    }
                default:
                    return status
            }
        },
        days_between(date1, date2) {
            // The number of milliseconds in one day
            const ONE_DAY = 1000 * 60 * 60 * 24;

            // Calculate the difference in milliseconds
            const differenceMs = Math.abs(date1 - date2);

            // Convert back to days and return
            return Math.round(differenceMs / ONE_DAY);
        }
    },
    mounted() {
    }
}


</script>