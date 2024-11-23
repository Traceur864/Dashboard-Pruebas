<template>
    <div class="text-h5 q-pb-md">Registrar un Tester</div>
        <q-form
            @submit="onSubmit"
            method="post"
            v-model="form"
        >
            <div class="row">

            <div class="col q-col-gutter-y-sm">
                <div class="row q-col-gutter-x-sm">
                    <div class="col column justify-center">
                        <q-input v-model="insert_tester_name" square filled type="text" maxlength="255" label="Nombre del Tester" />
                    </div>
                </div>

                <div class="row q-col-gutter-x-sm">
                    <div class="col column justify-center">
                        <q-select square filled v-model="insert_model_tester" label="Modelo en el que se utiliza" :options="models" />
                    </div>
                    <div class="col column justify-center">
                        <q-select square filled v-model="insert_area_tester" label="Area en la que se encuentra" :options="areas" />
                    </div>
                </div>

                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto self-end">
                        <q-btn class="q-mt-md" type="submit" color="positive" label="Registrar nuevo tester" />
                    </div>
                </div>
            </div>
            <input type="hidden">
        </div>
        </q-form>
</template>

<script>
    import {api} from 'boot/axios'
    import { useQuasar } from 'quasar';

    export default {
        setup(){
            const $q = useQuasar();
        },
        data(){
            return {
                insert_tester_name: '',
                insert_model_tester: '',
                insert_area_tester: '',
                models: [],
                areas: [],
                form : ''
            }
        }, methods: {
            loadData() {
                api.get('/model').then((response) =>{
                var data = response.data
                this.models = []
                for (const ele in data) {
                    this.models.push({
                    value: data[ele].ID_MODEL,
                    label: data[ele].MODEL
                    })
                }
                }).catch((err)=>{
                console.error(err);
                })

                api.get('/area').then((response) =>{
                var data = response.data
                this.areas = []
                for (const ele in data) {
                    this.areas.push({
                        value: data[ele].ID_AREA,
                        label: data[ele].AREA
                    })
                }
                }).catch((err)=>{
                console.error(err);
                })
            },
            onSubmit(){
                const dismiss = this.$q.notify({
                    spinner: true,
                    message: "Por favor, espera...",
                    timeout: 0
                })

                const params = new URLSearchParams()
                params.append('model_id', this.insert_model_tester.value)
                params.append('area_id', this.insert_area_tester.value)
                params.append('tester_name', this.insert_tester_name)

                const config ={
                    headers : {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                    }
                } 

                api.post('/tester',params, config).then((response)=>{
                    this.$q.notify({
                        type:'positive',
                        message: response.data,
                        position: "top"
                    })
                    
                    this.insert_tester_name = ''
                    this.insert_model_tester = ''
                    this.insert_area_tester = ''

                    dismiss()
                }).catch((err)=>{
                    var errors = err.response.data.error
                    console.error(errors);
                    for (const i in errors) {
                        this.$q.notify({
                            type: 'negative',
                            message: errors[i].msg,
                            position: "top"
                        })
                    }

                    dismiss()
                })
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>