<template>
    <q-dialog v-model="edit_tester_dialog">
        <q-card style="width: 100vh">
            <q-card-section>
                <div class="text-h5 q-pb-md">Editar Tester</div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="onSubmit" method="post" v-model="form">
                    <div class="row">

                        <div class="col q-col-gutter-y-sm">
                            <div class="row q-col-gutter-x-sm">
                                <div class="col column justify-center">
                                    <q-input v-model="edit_tester_name" square filled type="text" maxlength="255"
                                        label="Nombre del Tester" />
                                </div>
                            </div>

                            <div class="row q-col-gutter-x-sm">
                                <div class="col column justify-center">
                                    <q-select square filled v-model="edit_model_tester"
                                        label="Modelo en el que se utiliza" :options="models" />
                                </div>
                                <div class="col column justify-center">
                                    <q-select square filled v-model="edit_area_tester"
                                        label="Area en la que se encuentra" :options="areas" />
                                </div>
                            </div>

                            <div class="row q-col-gutter-x-sm">
                                <div class="col column justify-center">
                                    <q-select square filled v-model="edit_status_tester" label="Estado"
                                        :options="status" />
                                </div>
                            </div>

                            <div class="row">
                                <div class="col"></div>
                                <div class="col-auto self-end">
                                    <q-btn class="q-mt-md" type="submit" color="positive" label="Editar información" />
                                </div>
                            </div>
                        </div>
                        <input type="hidden" v-model="tester_id">
                    </div>
                </q-form>
            </q-card-section>

            <q-card-actions vertical align="right">
                <q-btn flat label="Cerrar" color="dark" v-close-popup />
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
    emits: ['reload'],
    data() {
        return {
            edit_tester_name: "",
            edit_model_tester: "",
            edit_area_tester: "",
            tester_id: "",
            edit_status_tester: "",
            status: [{ value: true, label: 'Activo' }, { value: false, label: 'Inactivo' }],
            form: {},
            models: [],
            areas: [],
            edit_tester_dialog: false
        }
    },
    methods: {
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('model_id', this.edit_model_tester.value)
            params.append('area_id', this.edit_area_tester.value)
            params.append('tester_name', this.edit_tester_name)
            params.append('status', this.edit_status_tester.value)
            params.append('tester_id', this.tester_id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/tester', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })

                this.edit_model_tester = ''
                this.edit_area_tester = ''
                this.edit_tester_name = ''
                this.edit_status_tester = ''
                this.tester_id = ''

                this.$emit('reload')
                this.edit_tester_dialog = false
            }).catch((error) => {
                dismiss()
                try {
                    var errors = error.response.data.error
                } catch (error) {
                    console.error(errors);
                }
                console.error(errors);
                for (const i in errors) {
                    this.$q.notify({
                        type: 'negative',
                        message: errors[i].msg,
                        position: "top"
                    })
                }
            });
        },
        loadData() {
            api.get('/model').then((response) => {
                var data = response.data
                this.models = []
                for (const ele in data) {
                    this.models.push({
                        value: data[ele].ID_MODEL,
                        label: data[ele].MODEL
                    })
                }
            }).catch((err) => {
                console.error(err);
            })

            api.get('/area').then((response) => {
                var data = response.data
                this.areas = []
                for (const ele in data) {
                    this.areas.push({
                        value: data[ele].ID_AREA,
                        label: data[ele].AREA
                    })
                }
            }).catch((err) => {
                console.error(err);
            })
        },
        get_data(id_tester) {
            api.get('/tester/' + id_tester).then((response) => {
                const data = response.data[0]
                this.edit_tester_name = data.TESTER_SN
                this.edit_model_tester = this.models.find(
                    (i) => i.value == data.ID_MODEL
                )
                this.edit_area_tester = this.areas.find(
                    (i) => i.value == data.ID_AREA
                )
                this.edit_status_tester = this.status.find(
                    (i) => i.value == data.STATUS
                )
                this.tester_id = id_tester
            }).catch((error) => {
                console.error(error);
            })
        },
        open_dialog() {
            this.edit_tester_dialog = true
        }
    },
    defineExposed() {
        get_data()
    },
    mounted() {
        this.loadData()
    }
}
</script>