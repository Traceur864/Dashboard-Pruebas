<template>
    <q-dialog v-model="edit_fixture_dialog">
        <q-card style="width: 100vh">
            <q-card-section>
                <div class="text-h5 q-pb-md">Editar Fixtura</div>                
            </q-card-section>

            <q-card-section>
                <q-form
                    @submit="onSubmit"
                    method="post"
                    v-model="form"
                >
                    <div class="row">

                    <div class="col q-col-gutter-y-sm">
                        <div class="row q-col-gutter-x-sm">
                            <div class="col column justify-center">
                                <q-input v-model="fixture_name" square filled type="text" maxlength="255" label="Nombre de la Fixtura" />
                            </div>
                        </div>

                        <div class="row q-col-gutter-x-sm">
                            <div class="col column justify-center">
                                <q-select square filled v-model="fixture_model" label="Modelo en el que se utiliza" :options="models" />
                            </div>
                            <div class="col column justify-center">
                                <q-select square filled v-model="fixture_status" label="Estado" :options="status" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col"></div>
                            <div class="col-auto self-end">
                                <q-btn class="q-mt-md" type="submit" color="positive" label="Editar información" />
                            </div>
                        </div>
                    </div>
                    <input type="hidden" v-model="fixture_id">
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
    import {api} from 'boot/axios'
    import { useQuasar } from 'quasar';

    export default {
        setup(){
            const $q = useQuasar()
        },
        components(){

        },
        emits : ['reload'],
        data(){
            return{
                models: [],
                form:{},
                status:[ {value: true, label: "Activo"},{value: false, label: "Inactivo"} ],
                edit_fixture_dialog: false,
                fixture_name: '',
                fixture_model: '',
                fixture_status: '',
                fixture_id: '',
            }
        },
        methods:{
            loadData(){
                api.get('/model').then((response) =>{
                    var data = response.data
                    this.models = []
                    data.forEach(element => {
                        this.models.push({
                            value: element.ID_MODEL,
                            label: element.MODEL
                        }) 
                    });
                }).catch((err)=>{
                    this.$q.notify({
                        type: 'negative',
                        message: 'Hubo un error al cargar los datos',
                        position: 'top'
                    })
                    console.error(err);
                })
            },
            openDialog(row){
                this.fixture_id = row.ID_FIXTURE
                api.get('/fixture/'+this.fixture_id).then((response) =>{
                    var data = response.data[0]
                    this.fixture_model = this.models.find(
                        (i) => i.value == data.ID_MODEL
                    )
                    this.fixture_status = this.status.find(
                        (i) => i.value == data.STATUS
                    )
                    this.fixture_name = data.FIXTURE_ID
                }).catch((error)=>{
                    console.error(error);
                })

                this.edit_fixture_dialog = true
            },
            onSubmit(){
                const dismiss = this.$q.notify({
                    spinner: true,
                    message: "Por favor, espera...",
                    timeout: 0
                })

                const params = new URLSearchParams()
                params.append('model_id', this.fixture_model.value)
                params.append('fixture_name', this.fixture_name)
                params.append('status', this.fixture_status.value)
                params.append('fixture_id', this.fixture_id)

                const config ={
                    headers : {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                    }
                }

                api.put('/fixture',params,config).then((response) =>{
                    dismiss()

                    this.$q.notify({
                        type:'positive',
                        message: response.data,
                        position: 'top'
                    })

                    this.$emit('reload')

                    this.fixture_name = ''
                    this.fixture_model = ''
                    this.fixture_status = ''
                    this.fixture_id = ''

                    this.edit_fixture_dialog = false

                }).catch((error)=>{
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
        },
        mounted(){
            this.loadData()
        }
    }
</script>