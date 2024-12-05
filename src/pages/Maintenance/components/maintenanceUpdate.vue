<template>
    <q-card-section>
        <div class="text-h6">
            Información del mantenimiento <span style="text-decoration: underline;">#235</span>
            <q-badge class="q-ml-md" color="orange" label="Atrasado" />
        </div>
    </q-card-section>

    <q-card-section>
        <div class="row q-col-gutter-x-sm q-pb-sm">
            <div class="col">
                <q-select v-model="tester_sn" :options="tester_serialnumbers" label="SN Tester" square filled />
            </div>
            <div class="col">
                <q-select v-model="fixture_sn" :options="fixtures_sns" label="ID Fixtura" square filled />
            </div>
            <div class="col">
                <q-select v-model="atm_sn" :options="atm_sns" label="SN ATM" square filled />
            </div>
        </div>

        <div class="row q-col-gutter-x-sm q-py-sm">
            <div class="col">
                <q-select v-model="event_type" :options="event_tps" label="Tipo de evento" square filled />
            </div>
            <div class="col">
                <q-input v-model="start_date" type="date" label="Fecha de inicio" square filled />
            </div>
        </div>

    </q-card-section>
</template>

<script>
import { api } from 'boot/axios'

export default {
    components: {

    },
    data() {
        return {
            //Global variables
            dialogInfo: false,
            tester_serialnumbers: [],
            testers: [],
            atm_sns: [],
            atms: [],
            fixtures_sns: [],
            fixtures: [],
            event_tps: ['Calibración', 'Mantenimiento'],
            tab: 'Modificar',

            //Model variables
            id_maintenance: null,
            tester_sn: null,
            fixture_sn: null,
            atm_sn: null,
            event_type: null,
            start_date: null,
        }
    },
    emits: ['reload'],
    props: [''],
    methods: {
        openDialog(id) {
            this.id_maintenance = id
            this.dialogInfo = true
            this.loadData()
            this.getData()
        },
        loadData() {

        },
        getData() {
            api.get('/maintenance/' + this.id_maintenance).then((response) => {
                var data = response.data[0]
                console.log(data)
            }).catch((error) => {

            })
        },
        setup() {

        },
    },
    mounted() {
        this.getData()
    }
}
</script>