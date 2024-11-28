<template>
    <q-dialog v-model="cancelDialog" persistent>
        <q-card style="width: 100vh">
            <q-card-section class="row items-center">
                <span class="text-h5">¿Cancelar Strain Gauge?</span>
            </q-card-section>
            <q-card-section>
                <q-input v-model="comments" square filled type="textarea" label="Comentarios"
                    hint='Agrega el motivo de la cancelación' maxlength="255" />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancelar" color="negative" @click="cancelEvent" />
                <q-btn flat label="Cerrar" color="dark" @click="cancelDialog = false" />
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
    emits: ['reload', 'move'],
    data() {
        return {
            cancelDialog: false,
            comments: '',
        }
    },
    methods: {
        openDialog() {
            this.cancelDialog = true;
        },
        cancelEvent() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('event_id', this.props.event_id)
            params.append('comments', this.comments)
            params.append('updated_by', 1) //TODO: Get USER_ID from LOCAL STORAGE

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/strain_gauge/cancel', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: 'top',
                })

                this.$emit('reload')
                this.$emit('move')
                this.cancelDialog = false

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
        },
    },
    mounted() {

    }
}
</script>