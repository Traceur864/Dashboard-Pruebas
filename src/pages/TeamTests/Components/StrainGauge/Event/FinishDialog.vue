<template>
    <q-dialog v-model="finishDialog" persistent>
        <q-card style="width: 100vh">
            <q-card-section class="row items-center">
                <span class="text-h5">¿Finalizar Strain Gauge?</span>
            </q-card-section>
            <q-card-section>
                <q-input v-model="comments" square filled type="textarea" label="Comentarios"
                    hint='En caso de no haber comentarios coloca "N/A"' maxlength="255" />
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
                        position: "top"
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