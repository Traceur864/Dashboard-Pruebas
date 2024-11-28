<template>
    <q-dialog v-model="startDialog" persistent>
        <q-card style="width: 100vh">
            <q-card-section class="row items-center">
                <span class="text-h5">¿Comenzar el Strain Gauge?</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Aceptar" color="positive" @click="startStrainGauge" />
                <q-btn flat label="Cancelar" color="dark" @click="startDialog = false" />
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
            startDialog: false
        }
    },
    methods: {
        openDialog() {
            this.startDialog = true;
        },
        startStrainGauge() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('event_id', this.props.event_id)
            params.append('status', 'En proceso')

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/strain_gauge/status', params, config).then((response) => {
                dismiss()
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })
                this.$emit('reload')
                this.startDialog = false
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