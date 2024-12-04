<template>
    <q-dialog v-model="edit_atm">
        <q-card style="width: 100vh">
            <q-card-section>
                <div class="text-h5 q-pb-md">Editar ATM</div>
            </q-card-section>

            <q-card-section>
                <div class="col q-col-gutter-y-sm">
                    <div class="row q-col-gutter-x-sm">
                        <div class="col column justify-center">
                            <q-input v-model="atm_sn" square filled type="text" maxlength="255" label="ATM SN" />
                        </div>
                        <div class="col column justify-center">
                            <q-select square filled v-model="location" label="Ubicación" :options="tester_serialnumbers"
                                @filter="filterTest" use-input input-debounce="0" />
                        </div>
                    </div>
                    <div class="row q-col-gutter-x-sm">
                        <div class="col-6">
                            <q-select square filled v-model="location" label="Estado" :options="status" />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions vertical align="right">
                <q-btn type="btn" @click="onSubmit" color="positive" label="Modificar" />
                <q-btn flat label="Cerrar" color="dark" @click="edit_atm = false" />
            </q-card-actions>

        </q-card>
    </q-dialog>

</template>

<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';

export default {
    setup() {
        const $q = useQuasar()
    },
    components() {

    },
    emits: ['reload'],
    data() {
        return {
            models: [],
            form: {},
            status: [{ value: true, label: "Activo" }, { value: false, label: "Inactivo" }],
            edit_atm: false,
            atm_sn: '',
            location: '',
            testers: [],
            tester_serialnumbers: [],
            id_atm: null,
        }
    },
    methods: {
        loadData() {
            api.get('/model').then((response) => {
                var data = response.data
                this.models = []
                data.forEach(element => {
                    this.models.push({
                        value: element.ID_MODEL,
                        label: element.MODEL
                    })
                });
            }).catch((err) => {
                this.$q.notify({
                    type: 'negative',
                    message: 'Hubo un error al cargar los datos',
                    position: 'top'
                })
                console.error(err);
            })

            api.get('/tester/active').then((response) => {
                var data = response.data
                this.tester_serialnumbers = []
                this.testers = []

                this.tester_serialnumbers.push({
                    label: 'ICT_LAB',
                    value: 'ICT_LAB'
                })

                data.forEach(ele => {
                    this.tester_serialnumbers.push({
                        value: ele.ID_TESTER,
                        label: ele.TESTER_SN
                    })
                });

                this.testers = this.tester_serialnumbers
            }).catch((err) => {
                console.error(err);
            })
        },
        getData() {
            api.get('/atm/' + this.id_atm).then((response) => {
                var data = response.data[0]
                this.atm_sn = data.ATM_SN
                this.location = data.LOCATION
                console.log(data);

            }).catch((err) => {
                console.error(err);
            })
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
        openDialog(id) {
            this.id_atm = id
            this.loadData()
            this.getData()
            this.edit_atm = true
        },
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('model_id', this.fixture_model.value)
            params.append('fixture_name', this.fixture_name)
            params.append('status', this.fixture_status.value)
            params.append('fixture_id', this.fixture_id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/fixture', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: 'top'
                })

                this.$emit('reload')

                this.fixture_name = ''
                this.fixture_model = ''
                this.fixture_status = ''
                this.fixture_id = ''

                this.edit_fixture_dialog = false

            }).catch((error) => {
                dismiss()
                try {
                    var errors = error.response.data.error
                } catch (error) {
                    console.error(errors);
                    console.error(error);
                }
                console.error(errors);
                errors.forEach(ele => {
                    this.$q.notify({
                        type: 'negative',
                        message: ele.msg,
                        position: "top"
                    })
                });

            })
        },
    },
    mounted() {
    }
}
</script>