<template>
    <q-dialog v-model="finishDialog" persistent>
        <q-card style="width: 100vh">
            <q-card-section class="row items-center">
                <span class="text-h5">¿Finalizar Strain Gauge?</span>
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <div class="col">
                        <q-input v-model="comments" square filled type="textarea" label="Comentarios"
                            hint='En caso de no haber comentarios coloca "N/A"' maxlength="255" />
                    </div>
                </div>
                <div class="row q-pt-md q-col-gutter-x-sm">
                    <div class="col">
                        <q-select v-model="asigned_to" :options="monitos" label="Responsable SG" square filled />
                    </div>
                    <div class="col">
                        <q-select v-model="shift" :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" square
                            filled />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Finalizar" color="positive" @click="finishStrainGauge" />
                <q-btn flat label="Cancelar" color="dark" @click="finishDialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    setup(props) {
        return {
            props
        }
    },
    props: ['event_id'],
    emits: ['reload'],
    data() {
        return {
            finishDialog: false,
            comments: '',
            monitos: [
                "Juan Carlos",
                'Miguelito',
                'Isela',
                'Joss',
                'Raúl'
            ],
            asigned_to: '',
            shift: '',
        }
    },
    methods: {
        openDialog() {
            this.finishDialog = true;
        },
        finishStrainGauge() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('event_id', this.props.event_id)
            params.append('comments', this.comments)
            params.append('shift', this.shift)
            params.append('asigned_to', this.asigned_to)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/strain_gauge/finish', params, config).then((response) => {
                dismiss()
                response.data.data.forEach(data => {
                    this.$q.notify({
                        type: 'positive',
                        message: data,
                        position: "top",
                        timeout: 5000
                    })
                });

                this.$emit('reload')
                this.finishDialog = false

            }).catch((error) => {

                dismiss()
                try {
                    var errors = error.response.data.error
                } catch (err) {
                    console.error(err);
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
        }
    },
    mounted() {

    }
}
</script>