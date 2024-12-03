<template>
    <q-dialog v-model="history_dialog" persistent>
        <q-card style="width: 90vw; max-width: 90vw;">
            <q-card-section>
                <div class="text-h4 q-px-xs">
                    Historial de personal
                </div>
            </q-card-section>
            <q-card-section class="row items-center">
                <q-grid title="Historial de Strain Gauges" :data="data" :columns="columns" row-key="name"
                    style="width: 100vw" :columns_filter="true">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td>
                                {{ props.row.ID_VACATION }}
                            </q-td>
                            <q-td align="center">
                                {{ props.row.EMPLOYEE_NAME }}
                            </q-td>
                            <q-td align="center">
                                {{ props.row.TURN }}
                            </q-td>
                            <q-td align="center">
                                <q-badge :color="get_color(props.row.EVENT_TYPE)" :label="props.row.EVENT_TYPE" />
                            </q-td>
                            <q-td align="center">
                                {{ props.row.START_DATE.substring(0, 10) }}
                            </q-td>
                            <q-td align="center">
                                {{ props.row.FINISH_DATE.substring(0, 10) }}
                            </q-td>
                            <q-td align="center">
                                <q-btn class="q-mx-sm" color="primary" icon="info"
                                    @click="openEvent(props.row.ID_EVENT)" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-grid>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="dark" @click="history_dialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { data } from 'autoprefixer';
//Enable Api requests
import { api } from 'boot/axios'

export default {
    data() {
        return {
            history_dialog: false,
            data: [],
            columns: [
                { name: 'id_vacation', field: 'ID_VACATION', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'employee_name', field: 'EMPLOYEE_NAME', required: true, label: 'Nombre', align: 'center', sortable: true },
                { name: 'shift', field: 'TURN', required: true, label: 'Turno', align: 'center', sortable: true },
                { name: 'event_type', field: 'EVENT_TYPE', required: true, label: 'Tipo de solicitud', align: 'center', sortable: true },
                { name: 'start_date', field: 'START_DATE', required: true, label: 'Fecha de inicio', align: 'center', sortable: true },
                { name: 'finish_date', field: 'FINISH_DATE', required: true, label: 'Fecha de fin', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center', sortable: true },
            ]
        }
    },
    methods: {
        openDialog() {
            this.history_dialog = true;
        },
        getData() {
            api.get('/vacation_calendar/').then((response) => {
                var info = response.data
                this.data = []
                info.forEach(dat => {
                    console.log();

                    this.data.push({
                        ID_VACATION: dat.ID_VACATION,
                        EMPLOYEE_NAME: dat.NAME + ' ' + dat.LASTNAME,
                        TURN: dat.TURN,
                        EVENT_TYPE: dat.EVENT_TYPE,
                        START_DATE: dat.START_DATE,
                        FINISH_DATE: dat.FINISH_DATE,
                        btn: ''
                    })
                });
            }).catch((error) => {
                console.error(error);
            })
        },
        get_color(type) {
            switch (type) {
                case 'Permiso sin goce':
                    return 'primary'
                case 'Vacaciones':
                    return 'positive'
                case 'Descanso':
                    return 'accent'
                case 'Domingo laborado':
                    return 'teal'
                case 'Falta':
                    return 'negative'
                case '4ta Falta':
                    return 'black'
                case 'Cancelado':
                    return 'blue-grey'
                default:
                    break;
            }
        }
    },
    setup() {

    },
    mounted() {
        this.getData();
    }
}
</script>