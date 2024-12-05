<template>
    <q-table title="Fixturas registradas" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn class="q-ma-xs" color="positive" icon="edit" @click="editFixture(props.row)" />
                <q-btn v-if="props.row.STATUS" class="q-ma-xs" color="negative" icon="delete"
                    @click="deleteFixture(props.row)" />
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
    <EditFixtureForm ref="editFixture" @reload="reload" />
    <DeleteFixtureDialog ref="deleteFixture" @reload="reload" />
</template>

<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';
import EditFixtureForm from './EditFixtureForm.vue';
import DeleteFixtureDialog from './DeleteFixtureDialog.vue';

export default {
    setup() {
        const $q = useQuasar()
    },
    data() {
        return {
            rows: [],
            columns: [
                { name: 'id_fixture', field: 'ID_FIXTURE', required: true, label: '#ID', align: 'left', sortable: true },
                { name: 'fixture_name', field: 'FIXTURE_ID', required: true, label: 'Fixture ID', align: 'center', sortable: true },
                { name: 'model', field: 'MODEL', required: true, label: 'Modelo', align: 'center', sortable: true },
                { name: 'status', field: 'STATUS', required: true, label: 'Estado', align: 'center', sortable: true },
                { name: 'actions', field: 'btn', required: true, label: 'Acciones', align: 'center', sortable: false },
            ]
        }
    },
    components: {
        EditFixtureForm,
        DeleteFixtureDialog,
    },
    emits: ["reload"],
    methods: {
        reload() {
            this.loadData()
            this.$emit("reload")
        },
        loadData() {
            api.get('/fixture').then((response) => {
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