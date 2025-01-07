<template>
    <q-dialog v-model="atmDialog" persistent>
        <q-card style="width: 80vw; max-width: 80vw; min-height: 35vh;">
            <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
                narrow-indicator>

                <q-tab :ripple="false" name="administrar" label="Administrar" />
                <q-tab :ripple="false" name="insertar" label="Registrar" />

            </q-tabs>


            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="administrar">
                    <ShowAtm @reload="reload" />
                </q-tab-panel>
                <q-tab-panel name="insertar">
                    <InsertAtm @reload="reload" />
                </q-tab-panel>
            </q-tab-panels>

            <q-card-actions align="right" class="vertical-bottom">
                <q-btn flat label="Cerrar" color="dark" @click="atmDialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<script>
import InsertAtm from './InsertAtm.vue';
import ShowAtm from './ShowAtm.vue';

export default {
    data() {
        return {
            atmDialog: false,
            tab: 'administrar'
        }
    },
    components: {
        InsertAtm,
        ShowAtm
    },
    emits: ["reload"],
    methods: {
        reload() {
            this.$emit('reload');
        },
        openDialog() {
            this.atmDialog = true;
        }
    },
    mounted() {

    }
}
</script>