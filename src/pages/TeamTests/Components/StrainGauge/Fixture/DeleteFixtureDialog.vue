<template>
    <q-dialog v-model="deleteDialog">
        <q-card style="width: 100vh;">
            <q-card-section class="row items-center">
                <span class="q-ml-sm text-h5">¿Eliminar Fixtura "{{fixture_name}}" ?</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="dark" v-close-popup />
                <q-btn label="Eliminar" color="negative" @click="onSubmit"/>
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
        data(){
            return{
                deleteDialog: false,
                fixture_id: "",
                fixture_name: "",
            }
        },
        methods:{
            openDialog(row){
                this.deleteDialog = true            
                this.fixture_id = row.ID_FIXTURE;
                this.fixture_name = row.FIXTURE_ID;
            },
            onSubmit(){
                const dismiss = this.$q.notify({
                    spinner: true,
                    message: "Por favor, espera...",
                    timeout: 0
                })

                const params = new URLSearchParams()
                params.append('fixture_id', this.fixture_id)

                const config ={
                    headers : {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                    }
                }

                api.put("fixture/delete", params, config).then((response)=>{
                    dismiss()
                    this.$q.notify({
                        type:'positive',
                        message: response.data,
                        position: "top"
                    })

                    this.$emit('reload')
                    this.deleteDialog = false

                }).catch((error)=>{
                    dismiss()
                    try {
                        var errors = error.response.data.error
                    } catch (error) {
                        console.error(errors);
                    }
                    console.error(errors);
                    errors.forEach(ele => {
                        this.$q.notify({
                            type: 'negative',
                            message: ele.msg,
                            position: "top"
                        }) 
                    });

                });
            }
        },
        emits:['reload'],
    }
</script>