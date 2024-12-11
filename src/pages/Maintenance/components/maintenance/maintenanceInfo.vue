<template>
    <q-card-section>
        <div class="text-h6 q-pb-lg">
            <div class="row">
                <div class="col-auto">
                    Información extra
                </div>
                <div class="col"></div>
                <div class="col-auto">
                    <q-btn color="positive" label="Registrar"
                        @click="this.$refs.insertDialog.openDialog(id_maintenance)" />
                </div>
            </div>
        </div>

        <div class="row">
            <q-grid title="Historial de Maintenimientos" :data="data" :columns="columns" row-key="name"
                style="width: 100vw" :columns_filter="true">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td align="center">
                            {{ props.row.ID_MAIN }}
                        </q-td>
                        <q-td align="center">
                            {{ props.row.EVENT_TITLE }}
                        </q-td>
                        <q-td align="center">
                            {{ props.row.PLAN_DATE.substring(0, 10) }}
                        </q-td>
                        <q-td align="center">
                            {{ props.row.REAL_DATE }}
                        </q-td>
                        <q-td align="center">
                            {{ props.row.STATUS_M }}
                        </q-td>
                        <q-td align="center">
                            <q-btn color="primary" icon="info"
                                @click="this.$refs.dialog.openDialog(props.row.ID_MAINTENANCE)" />
                        </q-td>
                    </q-tr>
                </template>
            </q-grid>
        </div>

    </q-card-section>
    <InsertInfo ref="insertDialog" @reload="reload" />
</template>
<script>
import { api } from 'boot/axios'
import InsertInfo from '../calibration/insertInfo.vue';

export default {
    components: {
        InsertInfo,
    },
    props: ['id_maintenance'],
    data() {
        return {
            data: [],
            columns: [
                { name: 'id_info', field: 'ID_MAIN', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'event_title', field: 'EVENT_TITLE', required: true, label: 'Título del evento', align: 'center', sortable: true },
                { name: 'plan_date', field: 'PLAN_DATE', required: true, label: 'Fecha planeada', align: 'center', sortable: true },
                { name: 'real_date', field: 'REAL_DATE', required: true, label: 'Fecha de finalización', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS_M', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center' },
            ],
        }
    },
    emits: ['reload'],
    methods: {
        reload() {
            this.getData()
            this.getInfo()
        },
        loadData() {

        },
        getInfo() {
            api.get('/maintenance_info/maintenance/' + this.id_maintenance).then((response) => {
                this.data = []
                var data = response.data
                var counter = 1
                data.forEach(dat => {

                    if (dat.REAL_DATE == null) {
                        dat.REAL_DATE = "N/A"
                    } else {
                        dat.REAL_DATE = dat.REAL_DATE.substring(0, 10)
                    }

                    this.data.push(
                        {
                            ID_MAIN: counter,
                            EVENT_TITLE: dat.EVENT_TITLE,
                            PLAN_DATE: dat.PLAN_DATE,
                            REAL_DATE: dat.REAL_DATE,
                            STATUS_M: dat.STATUS_MAIN,
                            btn: ''
                        }
                    )
                    counter++
                });
            }).catch((error) => {

            })
        },
        getData() {
            api.get('/maintenance/' + this.id_maintenance).then((response) => {
                var data = response.data[0]
                // console.log(data)
            }).catch((error) => {

            })
        },
    },
    mounted() {
        this.getInfo()
        this.getData()
    }
}
</script>