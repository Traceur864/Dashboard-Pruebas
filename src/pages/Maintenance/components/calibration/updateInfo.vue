<template>
    <q-dialog v-model="infoDialog" persistent>
        <q-card style="width: 70vw; max-width: 70vw; max-height: 70vh; ">
            <q-card-section class="items-center">
                <div class="text-h6 q-pb-sm">
                    Actualizar evento
                </div>

                <div class="row q-col-gutter-sm">
                    <div class="col-8">
                        <q-input v-model="event_title" filled type="text" label="Título del evento" />
                    </div>
                    <div class="col-4">
                        <q-input v-model="plan_date" filled type="date" label="Fecha compromiso" />
                    </div>
                </div>
                <div class="row q-pt-sm">
                    <div class="col">
                        <q-input v-model="event_description" type="textarea" rows="2" label="Descripción"
                            hint="Breve explicación de lo que se planea" filled />
                    </div>
                </div>
                <q-separator class="q-my-lg" />
                <div class="row">
                    <div class="col">
                        <q-input rows="2" v-model="comments" type="textarea" label="Comentarios" filled />
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Cancelar" color="negative" @click="confirmDialog" />
                <q-btn label="Modificar" color="positive" @click="onSubmit" />
                <q-btn flat label="Cerrar" color="black" @click="infoDialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    setup() {

    },
    emits: ['reload'],
    components: {

    },
    data() {
        return {
            infoDialog: false,
            id_maintenance: '',
            event_title: '',
            event_description: '',
            plan_date: null,
            comments: '',
            test: null,
        }
    },
    mounted() {
    },
    methods: {
        openDialog(id) {
            this.infoDialog = true
            this.id_maintenance = id
            this.getData()
        },
        getData() {
            api.get('/maintenance_info/' + this.id_maintenance).then((response) => {
                var data = response.data[0]
                this.event_title = data.EVENT_TITLE
                this.event_description = data.EVENT_DESCRIPTION
                this.plan_date = data.PLAN_DATE
                if (data.PLAN_DATE != null) {
                    this.plan_date = data.PLAN_DATE.substring(0, 10)
                }
                this.comments = data.COMMENTS
            }).catch((error) => {
                this.$q.notify({
                    type: 'negative',
                    message: "Error al recuperar la información",
                    position: "top",
                })
                console.error(error);
                this.infoDialog = false
            })
        },
        confirmDialog() {
            this.$q.dialog({
                title: '¿Cancelar mantenimiento?',
                prompt: {
                    model: '',
                    type: 'textarea',
                    label: 'Comentarios',
                    filled: true,
                    rows: 4,
                    hint: 'Explica el motivo de cancelación del mantenimiento',
                },
                ok: {
                    label: 'Cancelar',
                    color: 'negative',
                },
                cancel: {
                    label: 'Cerrar',
                    color: 'black',
                    flat: true,
                },
            }).onOk((data) => {
                this.comments = data
                this.cancelEvent()
            })
        },
        cancelEvent() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_main_info', this.id_maintenance)
            params.append('comments', this.comments)
            // TODO: GET USER ID FROM LOCAL STORAGE
            // params.append('created_by', this.current_user.id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/maintenance_info/cancel/', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top",
                })

                this.$emit('reload')
                this.clearFields()
                this.infoDialog = false

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
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_main_info', this.id_maintenance)
            params.append('title', this.event_title)
            params.append('description', this.event_description)
            params.append('comments', this.comments)
            params.append('plan_date', this.plan_date)
            // TODO: GET USER ID FROM LOCAL STORAGE
            // params.append('created_by', this.current_user.id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/maintenance_info/', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top",
                })

                this.$emit('reload')
                this.clearFields()
                this.infoDialog = false

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
        clearFields() {
            this.event_title = ''
            this.event_description = ''
            this.comments = null
            this.plan_date = null
        }
    }
}
</script>