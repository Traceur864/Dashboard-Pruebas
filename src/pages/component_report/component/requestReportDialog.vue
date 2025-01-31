<template>
    <q-dialog v-model="requestDialog">
        <q-card style="width: 250vh;">
            <q-card-section class="items-center">
                <span class="text-h6">Solicitar reporte</span>
                <hr>
                <div class="row q-pb-md">
                    <div class="col">
                        <q-input v-model="comp_name" square filled type="text" label="Nombre del componente"
                            hint="El nombre no debe llevar espacios extra al incio ni al final" />
                    </div>
                </div>
                <div class="row q-pb-md">
                    <div class="col">
                        <q-select v-model="model" :options="['MDA', 'ICT', 'PG520', 'P2312']" label="Modelo" filled />
                    </div>
                </div>
                <div class="row q-col-gutter-x-sm">
                    <div class="col">
                        <q-input square filled v-model="start_date" type="date" label="Fecha de inicio" />
                    </div>
                    <div class="col">
                        <q-input square filled v-model="end_date" type="date" label="Fecha de fin" />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="dark" @click="requestDialog = false" />
                <q-btn label="Solicitar" color="positive" @click="submitRequest()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios';

export default {
    data() {
        return {
            requestDialog: false,
            comp_name: '',
            start_date: '',
            end_date: '',
            model: []
        }
    },
    emits: ["reload"],
    methods: {
        openDialog() {
            this.requestDialog = true;
        },
        submitRequest() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('comp_name', this.comp_name)
            params.append('start_date', this.start_date)
            params.append('end_date', this.end_date)
            params.append('model', this.model)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.post('/ict_data/component_report', params, config).then((response) => {
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })

                dismiss()

                this.atm_sn = ''
                this.location = ''
                this.$emit('reload')
                this.clear_data()
                this.requestDialog = false
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
                this.requestDialog = false
            })
        },
        clear_data() {
            this.comp_name = ''
            this.start_date = ''
            this.end_date = ''
            this.model = []
        }
    },

}
</script>