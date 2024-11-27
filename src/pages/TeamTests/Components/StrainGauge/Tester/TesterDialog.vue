<template>
    <q-dialog :model-value="tester_dialog">
        <q-card style="width: 80vw; max-width: 80vw; min-height: 35vh;">
            <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
                narrow-indicator>

                <q-tab :ripple="false" name="administrar" label="Administrar" />
                <q-tab :ripple="false" name="insertar" label="Registrar" />

            </q-tabs>


            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="administrar">
                    <ShowTestersForm @reload="reload" />
                </q-tab-panel>
                <q-tab-panel name="insertar">
                    <InsertTesterForm @reload="reload" />
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
    data() {
        return {
            tab: 'administrar',
            tester_dialog: false,
        }
    },
    components: {
        InsertTesterForm,
        ShowTestersForm,
    },
    //Import variable as prop so it can be accessed from parent
    methods: {
        reload() {
            this.$emit('reload');
        },
        openDialog() {
            this.tester_dialog = true;
        }
    },
    mounted() {
        // this.showAlert()
    }
}
</script>