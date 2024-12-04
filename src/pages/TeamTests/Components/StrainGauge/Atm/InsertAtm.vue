<template>
    <div class="text-h5 q-pb-md">Registrar un ATM</div>
    <div class="row">
        <div class="col q-col-gutter-y-sm">
            <div class="row q-col-gutter-x-sm">
                <div class="col column justify-center">
                    <q-input v-model="atm_sn" square filled type="text" maxlength="255" label="ATM SN" />
                </div>
                <div class="col column justify-center">
                    <q-select square filled v-model="location" label="Ubicación" :options="testers" />
                </div>
            </div>

            <div class="row">
                <div class="col"></div>
                <div class="col-auto self-end">
                    <q-btn class="q-mt-md" type="btn" @click="onSubmit" color="positive" label="Registrar nuevo ATM" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar';

export default {
    setup() {
        const $q = useQuasar()
    },
    data() {
        return {
            testers: [],
            atm_sn: '',
            location: '',
        }
    },
    emits: ['reload'],
    methods: {
        loadData() {
            api.get('/tester').then((response) => {
                const data = response.data

                this.testers.push({
                    label: 'ICT_LAB',
                    value: 'ICT_LAB'
                })

                data.forEach(ele => {
                    this.testers.push({
                        label: ele.TESTER_SN,
                        value: ele.ID_TESTER
                    });
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
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('location', this.location.value)
            params.append('atm_sn', this.atm_sn)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.post('/atm', params, config).then((response) => {
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })

                dismiss()

                this.atm_sn = ''
                this.location = ''
                this.$emit('reload')
            }).catch((error) => {
                var error = err.response.data.error
                console.error(error);

                error.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        }
    },
    mounted() {
        this.loadData()
    },
}
</script>