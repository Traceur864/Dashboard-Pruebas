<template>
    <q-dialog v-model="showMaintenance" persistent>
        <q-card style="width: 90vw; max-width: 90vw;">
            <q-card-section>
                <div class="text-h6">Historial de Mantenimientos</div>
            </q-card-section>

            <q-card-section class="row items-center">
                <q-grid title="Historial de Maintenimientos" :data="data" :columns="columns" row-key="name"
                    style="width: 100vw" :columns_filter="true">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td>
                                {{ props.row.ID_MAINTENANCE }}
                            </q-td>
                            <q-td>
                                {{ props.row.EVENT_TYPE }}
                            </q-td>
                            <q-td>
                                {{ props.row.MACHINE }}
                            </q-td>
                            <q-td>
                                {{ props.row.START_DATE }}
                            </q-td>
                            <q-td>
                                {{ props.row.FINISH_DATE }}
                            </q-td>
                            <q-td>
                                <q-badge
                                    :color="getColor(setStatus(props.row.STATUS_M, props.row.EVENT_TYPE, props.row.START_DATE))"
                                    :label="setStatus(props.row.STATUS_M, props.row.EVENT_TYPE, props.row.START_DATE)" />
                            </q-td>
                            <q-td>
                                <q-btn color="primary" icon="info" @click="openEvent(props.row.ID_EVENT)" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-grid>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="dark" @click="showMaintenance = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    setup() {
    },
    components: {
    },
    emits: ['reload'],
    data() {
        return {
            showMaintenance: false,
            data: [],
            columns: [
                { name: 'id_maintenance', field: 'ID_MAINTENANCE', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'event_type', field: 'EVENT_TYPE', required: true, label: 'Tipo de evento', align: 'center', sortable: true },
                { name: 'machine', field: 'MACHINE', required: true, label: 'SN Equipo', align: 'center', sortable: true },
                { name: 'start_date', field: 'START_DATE', required: true, label: 'Fecha limite', align: 'center', sortable: true },
                { name: 'finish_date', field: 'FINISH_DATE', required: true, label: 'Fecha de finalización', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS_M', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center' },
            ],
        }
    },
    methods: {
        openDialog() {
            this.showMaintenance = true;
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

            api.get('/maintenance').then((response) => {
                response.data.forEach(dat => {
                    if (dat.FINISH_DATE != null) {
                        dat.FINISH_DATE = dat.FINISH_DATE.substring(0, 10)
                    } else {
                        dat.FINISH_DATE = 'N/A'
                    }

                    if (dat.ID_FIXTURE != null) {
                        dat.MACHINE = dat.FIXTURE_ID
                    } else if (dat.ID_TESTER != null) {
                        dat.MACHINE = dat.TESTER_SN
                    } else if (dat.ID_ATM != null) {
                        dat.MACHINE = dat.ATM_SN
                    }

                    this.data.push({
                        ID_MAINTENANCE: dat.ID_MAINTENANCE,
                        EVENT_TYPE: dat.EVENT_TYPE,
                        MACHINE: dat.MACHINE,
                        START_DATE: dat.PLAN_DATE.substring(0, 10),
                        FINISH_DATE: dat.FINISH_DATE,
                        STATUS_M: dat.STATUS_M,
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
                case 'Fallido':
                    return 'negative'
                case 'Asignado':
                    return 'primary'
                case 'Atrasado':
                    return 'deep-orange'
                case 'Finalizado':
                    return 'positive'
                default:
                    return 'black'
            }
        },
        setStatus(status, event_type, plan_date) {
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
                }
            }
        },
    },
    mounted() {
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