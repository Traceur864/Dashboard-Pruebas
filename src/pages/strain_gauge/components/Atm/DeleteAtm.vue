<template>
    <q-dialog v-model="deleteDialog">
        <q-card style="width: 100vh;">
            <q-card-section class="row items-center">
                <span class="q-ml-sm text-h5">¿Eliminar ATM: "{{ atm_name }}" ?</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="dark" @click="deleteDialog = false" />
                <q-btn label="Eliminar" color="negative" @click="onSubmit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    emits: ['reload'],
    components: {

    },
    data() {
        return {
            deleteDialog: false,
            atm_name: '',
            atm_id: null,
        }
    },
    methods: {
        openDialog(id) {
            this.atm_id = id
            this.loadData()
            this.getData()
            this.deleteDialog = true
        },
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_atm', this.atm_id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/atm/delete', params, config).then((response) => {
                dismiss()

                this.$q.notify({
                    type: 'positive',
                    message: response.data,
                    position: 'top'
                })

                this.$emit('reload')

                this.deleteDialog = false

            }).catch((error) => {
                dismiss()
                try {
                    var errors = error.response.data.error
                } catch (error) {
                    console.error(errors);
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
        getData() {
            api.get('/atm/' + this.atm_id).then((response) => {
                var data = response.data[0]
                this.atm_name = data.ATM_SN

            }).catch((err) => {
                console.error(err);
            })
        },
        loadData() {

        },
    },
    mounted() {

    },
    setup() {

    }
}
</script>