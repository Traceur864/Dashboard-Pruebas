<template>
    <q-dialog :model-value="insert_test_dialog">
      <q-card style="width: 700px; max-width: 80vw;">
            <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            >

            <q-tab :ripple="false" name="administrar" label="Administrar" />
            <q-tab :ripple="false" name="editar" label="Editar" />
            <q-tab :ripple="false" name="insertar" label="Insertar" />

            </q-tabs>


            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="administrar">
                    <EditTesterForm/>
                </q-tab-panel>
                <q-tab-panel name="editar">
                    <div class="text-h6">Alarms</div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel>
                <q-tab-panel name="insertar">
                    <div class="text-h6">Movies</div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel>
            </q-tab-panels>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="dark" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
    import EditTesterForm from './EditTesterForm.vue';
    export default {
        data(){
            return {
                tab: 'administrar',
            }
        },
        components:{
            EditTesterForm
        },
        //Import variable as prop so it can be accessed from parent
        props:[
            'insert_test_dialog'
        ],
        methods: {
        },
        mounted(){
            // this.showAlert()
        }
    }
</script>