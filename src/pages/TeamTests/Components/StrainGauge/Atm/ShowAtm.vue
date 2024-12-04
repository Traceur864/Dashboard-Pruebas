<template>
    <q-table title="ATMs Registrados" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-location="props">
            <q-td :props="props">
                <div v-if="props.row.LOCATION == 'ICT_LAB'">
                    {{ props.row.LOCATION }}
                </div>
                <div v-else>
                    {{ props.row.TESTER_SN }}
                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn class="q-ma-xs" color="positive" icon="edit"
                    @click="this.$refs.editAtm.openDialog(props.row.ID_ATM)" />
                <q-btn v-if="props.row.STATUS_ATM" class="q-ma-xs" color="negative" icon="delete"
                    @click="deleteFixture(props.row)" />
            </q-td>
        </template>
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <div v-if="props.row.STATUS_ATM">
                    <q-badge color="positive" label="Activo" />
                </div>
                <div v-else>
                    <q-badge color="negative" label="Inactivo" />
                </div>
            </q-td>
        </template>
    </q-table>
    <EditAtm ref="editAtm" />
</template>

<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';
import EditAtm from './EditAtm.vue';

export default {
    setup() {
        const $q = useQuasar()
    },
    data() {
        return {
            rows: [],
            columns: [
                { name: 'id_fixture', field: 'ID_ATM', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'fixture_name', field: 'ATM_SN', required: true, label: 'ATM SN', align: 'center', sortable: true },
                { name: 'location', field: 'LOCATION', required: true, label: 'Ubicación', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS_ATM', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center', sortable: false },
            ]
        }
    },
    components: {
        EditAtm,
    },
    emits: ["reload"],
    methods: {
        reload() {
            this.loadData()
            this.$emit("reload")
        },
        loadData() {
            api.get('/atm').then((response) => {
                this.rows = response.data
            }).catch((error) => {
                this.$q.notify({
                    type: 'negative',
                    message: "Ha ocurrido un error al cargar la información",
                    position: "top"
                })
                console.error(error);
            })
            this.$emit("reload")
        },
        editFixture(row) {
            this.$refs.editFixture.openDialog(row)
        },
        deleteFixture(row) {
            this.$refs.deleteFixture.openDialog(row)
        },
    },
    mounted() {
        this.loadData()
    }
}
</script>