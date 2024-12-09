<template>
    <q-dialog v-model="updateDialog" persistent>
        <q-card style="width: 80vw; max-width: 70vw;">
            <q-card-section>
                <div class="text-h6">Modificar mantenimiento</div>
            </q-card-section>

            <q-card-section class="items-center">
                <div class="row" v-if="data.atm_name != null">
                    <div class="col-auto">
                        <q-badge color="warning" rounded />
                    </div>
                    <div class="col q-pl-sm">
                        El ATM a calibrar es: <span class="text-italic text-bold">{{ data.atm_name }}</span>
                    </div>
                </div>
                <div class="row q-pt-md">
                    <div class="col">
                        <q-input filled square v-model="comments" type="textarea"
                            hint="Especifica a que se debe el cambio" rows="2" label="Comentarios" />
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="dark" @click="closeDialog" />
                <q-btn color="positive" label="Modificar" @click="updateMaintenance" />
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
            updateDialog: false,
            comments: '',
            data: {},
        }
    },
    methods: {
        openDialog(data) {
            this.data = data
            this.updateDialog = true;

            if (data.tester_sn != null && data.event_type == 'Calibración') {
                this.getData()
            }
        },
        closeDialog() {
            this.updateDialog = false
            this.data = {}
        },
        updateMaintenance() {
            const params = new URLSearchParams()

            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            if (this.data.atm_sn != null) {
                this.data.atm_sn = this.data.atm_sn.value
            }

            if (this.data.fixture_sn != null) {
                this.data.fixture_sn = this.data.fixture_sn.value
            }

            if (this.data.tester_sn != null) {
                this.data.tester_sn = this.data.tester_sn.value
            }

            params.append('id_maintenance', this.data.id_maintenance)
            params.append('id_atm', this.data.atm_sn)
            params.append('start_date', this.data.start_date)
            params.append('id_fixture', this.data.fixture_sn)
            params.append('id_tester', this.data.tester_sn)
            params.append('event_type', this.data.event_type)
            params.append('comments', this.comments)
            params.append('updated_by', 1)
            // TODO: GET USER ID FROM LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/maintenance', params, config).then((response) => {
                dismiss()
                console.log(response);

                this.$q.notify({
                    type: "positive",
                    message: response.data,
                    position: 'top'
                })

                this.updateDialog = false
                this.$emit('reload')
            }).catch((error) => {
                console.error(error);
                var errors = error.response.data.error

                errors.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        //GETS ATM NAME BY LOCATION BASED ON TESTER ID
        getData() {
            api.get('/atm/tester/' + this.data.tester_sn.value).then((response) => {
                var data = response.data[0]
                this.data.atm_name = data.ATM_SN
                this.data.atm_sn = { value: data.ID_ATM }
                this.data.tester_sn = null
            }).catch((err) => {
                var errors = err.response.data.error
                console.error(err);

                errors.forEach(erro => {
                    this.$q.notify({
                        type: 'negative',
                        message: erro.msg,
                        position: "center",
                    })
                });

                this.updateDialog = false
            })
        }

    },
    mounted() {

    }
}
</script>