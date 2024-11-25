<template>
    <q-dialog v-model="deleteDialog">
        <q-card>
            <q-card-section class="row items-center">
                <span class="q-ml-sm text-h4">¿Eliminar Tester "{{tester_sn}}" ?</span>
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
                
            }
        },
    }
</script>