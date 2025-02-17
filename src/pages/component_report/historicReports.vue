<template>
    <q-page class="q-pa-md">
        <h1 class="text-h5">Comportamiento de componentes</h1>
        <div class="row">
            <div class="col-auto q-pb-md">
                <q-btn color="primary" icon="summarize" label="Solicitar reporte"
                    @click="this.$refs.requestDialog.openDialog()" />
            </div>
        </div>
        <q-table title="Reportes solicitados" :rows="rows" :columns="columns" row-key="name"
            v-model:pagination="pagination">
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <div v-if="props.row.REPORT_STATUS == 'Solicitado'">
                        <q-badge color="primary" label="Solicitado" />
                    </div>
                    <div v-if="props.row.REPORT_STATUS == 'En proceso'">
                        <q-badge color="black" label="En proceso" />
                    </div>
                    <div v-if="props.row.REPORT_STATUS == 'Fallido'">
                        <q-badge color="negative" label="Fallido" />
                    </div>
                    <div v-if="props.row.REPORT_STATUS == 'Finalizado'">
                        <q-badge color="positive" label="Finalizado" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn v-if="props.row.REPORT_STATUS == 'Finalizado'" class="q-ma-xs" color="positive"
                        icon="visibility" @click="$router.push('/component_report/' + props.row.REPORT_ID)" />
                    <q-btn class="q-ma-xs" color="negative" icon="delete" />
                </q-td>
            </template>
        </q-table>
    </q-page>
    <RequestReportDialog ref="requestDialog" @reload="reload" />
</template>

<script>
import { api } from 'boot/axios';
import RequestReportDialog from './component/requestReportDialog.vue';
import { ref, computed } from 'vue'

export default {
    setup() {
        const pagination = ref({
            sortBy: 'id_report',
            descending: true,
            page: 1,
            rowsPerPage: 10
        })
        return {
            pagination
        }
    },
    data() {
        return {
            component_name: '',
            start_date: '',
            end_date: '',
            rows: [],
            columns: [
                { name: 'id_report', field: 'REPORT_ID', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'component_name', field: 'COMPONENT_NAME', required: true, label: 'Componente', align: 'center', sortable: true },
                { name: 'date_range', field: 'range', required: true, label: 'Rangos de busqueda', align: 'center', sortable: true },
                { name: 'requested_at', field: 'REQUESTED_AT', required: true, label: 'Solicitado el', align: 'center', sortable: true },
                { name: 'finished_at', field: 'FINISHED_AT', required: true, label: 'Ultima actualización', align: 'center', sortable: true },
                { name: 'status', field: 'REPORT_STATUS', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center', sortable: false },
            ]
        }
    },
    components: {
        RequestReportDialog
    },
    methods: {
        getData() {
            api.get('/ict_data/component_report').then((response) => {
                this.rows = response.data
                this.rows.forEach(el => {
                    el.REQUESTED_AT = el.REQUESTED_AT.substring(0, 10) + " a las " + new Date(el.REQUESTED_AT).toLocaleTimeString()

                    if (el.FINISHED_AT != null) {
                        el.FINISHED_AT = el.FINISHED_AT.substring(0, 10) + " a las " + new Date(el.FINISHED_AT).toLocaleTimeString()
                    }

                    if (el.START_DATE != null) {
                        el.range = "Del " + el.START_DATE.substring(0, 10) + " al " + el.END_DATE.substring(0, 10)
                    }
                });

            }).catch((error) => {
                this.$q.notify({
                    type: 'negative',
                    message: "Ha ocurrido un error al cargar la información",
                    position: "top"
                })
                console.error(error);
            })
        },
        reload() {
            this.getData()
        },
    },
    mounted() {
        this.getData()
    }
}
</script>