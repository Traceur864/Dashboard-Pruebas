<template>
    <q-dialog :model-value="tester_dialog">
      <q-card style="width: 80vw; max-width: 80vw; height: 85vh;">
            <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            >

            <q-tab :ripple="false" name="administrar" label="Administrar" />
            <q-tab :ripple="false" name="insertar" label="Registrar" />

            </q-tabs>


            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="administrar">
                    <ShowTestersForm/>
                </q-tab-panel>
                <q-tab-panel name="insertar">
                    <InsertTesterForm/>
                </q-tab-panel>
            </q-tab-panels>

        <q-card-actions align="right" class="vertical-bottom">
          <q-btn flat label="Cerrar" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
    import InsertTesterForm from './InsertTesterForm.vue';
    import ShowTestersForm from './ShowTestersForm.vue';

    export default {
        data(){
            return {
                tab: 'administrar',
            }
        },
        components:{
            InsertTesterForm,
            ShowTestersForm,
        },
        //Import variable as prop so it can be accessed from parent
        props:[
            'tester_dialog'
        ],
        methods: {
        },
        mounted(){
            // this.showAlert()
        }
    }
</script>