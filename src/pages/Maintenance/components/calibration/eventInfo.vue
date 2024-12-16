<template>
    <q-dialog v-model="infoDialog" persistent>
        <q-card style="width: 70vw; max-width: 70vw; max-height: 70vh; ">
            <q-card-section class="items-center">
                <div class="text-h6 q-pb-sm">
                    Información de evento <q-badge color="primary" :label="status" />
                </div>

                <div class="row q-col-gutter-sm">
                    <div class="col-6">
                        <q-input readonly v-model="event_title" filled type="text" label="Título del evento" />
                    </div>
                    <div class="col">
                        <q-input readonly v-model="plan_date" filled type="date" label="Fecha compromiso" />
                    </div>
                    <div class="col" v-if="real_date != null">
                        <q-input readonly v-model="real_date" filled type="date" label="Fecha de finalización" />
                    </div>
                </div>
                <div class="row q-pt-sm">
                    <div class="col">
                        <q-input readonly v-model="event_description" type="textarea" rows="2" label="Descripción"
                            hint="Breve explicación de lo que se planea" filled />
                    </div>
                </div>
                <q-separator class="q-my-lg" />
                <div class="row q-mb-sm">
                    <div class="col">
                        <q-input readonly rows="2" v-model="comments" type="textarea" label="Comentarios" filled />
                    </div>
                </div>
                <div class="row q-col-gutter-sm">
                    <div class="col">
                        <q-input readonly v-model="created_by" type="text" label="Creado por" filled />
                    </div>
                    <div class="col">
                        <q-input readonly v-model="created_at" type="text" label="Creado a las" filled />
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
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
            created_by: null,
            created_at: null,
            real_date: null,
            plan_date: null,
            comments: null,
            status: null,
            color: null,
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
                this.status = data.STATUS_MAIN
                this.event_title = data.EVENT_TITLE
                this.event_description = data.EVENT_DESCRIPTION

                this.plan_date = data.PLAN_DATE
                if (this.plan_date != null) {
                    this.plan_date = this.plan_date.substring(0, 10)
                }

                this.comments = data.COMMENTS
                this.created_by = data.CREATED_NAME
                this.created_at = data.CREATED_AT.substring(0, 10) + " a las " + data.CREATED_AT.substring(11, 19)
                this.real_date = data.REAL_DATE

                if (this.real_date != null) {
                    this.real_date = this.real_date.substring(0, 10)
                }
            }).catch((error) => {
                this.$q.notify({
                    type: 'negative',
                    message: "Error al recuperar la información",
                    position: "top",
                })
                console.log(error);
                this.infoDialog = false
            })
        },
    }
}
</script>