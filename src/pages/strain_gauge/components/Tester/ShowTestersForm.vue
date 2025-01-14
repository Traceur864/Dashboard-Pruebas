<template>
    <q-table title="Tester registrados" :rows="rows" :columns="columns" row-key="name" virtual-scroll>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn class="q-ma-xs" color="positive" icon="edit" @click="editTester(props.row)" />
                <q-btn v-if="props.row.STATUS" class="q-ma-xs" color="negative" icon="delete"
                    @click="deleteTester(props.row)" />
            </q-td>
        </template>
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <div v-if="props.row.STATUS">
                    Activo
                </div>
                <div v-else>
                    Inactivo
                </div>
            </q-td>
        </template>
    </q-table>

    <EditTesterForm ref="editForm" @reload="reload" />
    <DeleteDialog ref="deleteDialog" @reload="reload" />

</template>

<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';
import EditTesterForm from './EditTesterForm.vue';
import DeleteDialog from './DeleteTesterDialog.vue';

export default {
    setup() {

    },
    emits: ["reload"],
    components: {
        EditTesterForm,
        DeleteDialog
    },
    data() {
        return {
            columns: [
                { name: 'id_tester', field: 'ID_TESTER', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'tester_sn', field: 'TESTER_SN', required: true, label: 'Tester SN', align: 'center', sortable: true },
                { name: 'model', field: 'MODEL', required: true, label: 'Modelo al que pertence', align: 'center', sortable: true },
                { name: 'area', field: 'AREA', required: true, label: 'Area a la que pertenece', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', label: 'Acciones', required: true, align: 'center' },
            ],
            rows: [],
            edit_tester_dialog: false,
        }
    },
    mixins: [EditTesterForm],
    props: ['id_tester'],
    methods: {
        reload() {
            this.getTesters()
            this.$emit('reload')
        },
        getTesters() {
            this.rows = []  // Clear array
            api.get('/tester').then((response) => {
                var data = response.data;
                data.forEach(element => {
                    this.rows.push(element)
                });
            }).catch((error) => {
                console.error(error);
            })
        },
        editTester(row) {
            this.$refs.editForm.open_dialog()
            this.$refs.editForm.get_data(row.ID_TESTER)
        },
        deleteTester(row) {
            this.$refs.deleteDialog.open_dialog()
            this.$refs.deleteDialog.set_data(row)
        }
    },
    mounted() {
        this.getTesters()
    },
}
</script>