<template>
    <div class="text-h5 q-pb-md">Registrar una Fixtura</div>
    <q-form @submit="onSubmit" method="post" v-model="form">
        <div class="row">

            <div class="col q-col-gutter-y-sm">
                <div class="row q-col-gutter-x-sm">
                    <div class="col column justify-center">
                        <q-input v-model="fixture_name" square filled type="text" maxlength="255"
                            label="ID de la Fixtura" />
                    </div>
                    <div class="col column justify-center">
                        <q-select square filled v-model="fixture_model" label="Modelo en el que se utiliza"
                            :options="models" />
                    </div>
                </div>

                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto self-end">
                        <q-btn class="q-mt-md" type="submit" color="positive" label="Registrar nueva Fixtura" />
                    </div>
                </div>
            </div>
            <input type="hidden">
        </div>
    </q-form>
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
            models: [],
            fixture_model: '',
            fixture_name: '',
            form: {}
        }
    },
    emits: ['reload'],
    methods: {
        loadData() {
            api.get('/model').then((response) => {
                const data = response.data
                data.forEach(ele => {
                    this.models.push({
                        label: ele.MODEL,
                        value: ele.ID_MODEL
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
            params.append('model_id', this.fixture_model.value)
            params.append('fixture_name', this.fixture_name)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.post('/fixture', params, config).then((response) => {
                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: "top"
                })

                dismiss()

                this.fixture_name = ''
                this.fixture_model = ''
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