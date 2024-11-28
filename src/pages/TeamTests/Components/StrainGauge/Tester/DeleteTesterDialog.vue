<template>
    <q-dialog v-model="deleteDialog">
        <q-card style="width: 100vh;">
            <q-card-section class="row items-center">
                <span class="q-ml-sm text-h5">¿Eliminar Tester "{{tester_sn}}" ?</span>
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
    import {ref} from 'vue';

    export default {
        data(){
            return{
                deleteDialog: false,
                tester_sn: "",
                tester_id: "",
            }
        },
        methods:{
            open_dialog(){
                this.deleteDialog = true
            },
            set_data(data){
                this.tester_sn = data.TESTER_SN;
                this.tester_id = data.ID_TESTER;
            },
            onSubmit(){
                const dismiss = this.$q.notify({
                    spinner: true,
                    message: "Por favor, espera...",
                    timeout: 0
                })

                const params = new URLSearchParams()
                params.append('tester_id', this.tester_id)

                const config ={
                    headers : {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                    }
                }

                api.put("tester/delete", params, config).then((response)=>{
                    dismiss()
                    this.$q.notify({
                        type:'possitive',
                        message: "Tester eliminado exitosamente"
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
                    for (const i in errors) {
                        this.$q.notify({
                            type: 'negative',
                            message: errors[i].msg,
                            position: "top"
                        })
                    }
                });
            }
        },
        emits:['reload'],
    }
</script>