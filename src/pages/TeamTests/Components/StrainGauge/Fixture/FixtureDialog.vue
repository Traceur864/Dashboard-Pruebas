<template>
    <q-dialog v-model="fixtureDialog">
        <q-card style="width: 80vw; max-width: 80vw; min-height: 35vh;">
            <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="justify"
                narrow-indicator>

                <q-tab :ripple="false" name="administrar" label="Administrar" />
                <q-tab :ripple="false" name="insertar" label="Registrar" />

            </q-tabs>


            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="administrar">
                    <ShowFixtureForm @reload="reload" />
                </q-tab-panel>
                <q-tab-panel name="insertar">
                    <InsertFixtureForm @reload="reload" />
                </q-tab-panel>
            </q-tab-panels>

            <q-card-actions align="right" class="vertical-bottom">
                <q-btn flat label="Cerrar" color="dark" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import InsertFixtureForm from "./InsertFixtureForm.vue"
import ShowFixtureForm from "./ShowFixtureForm.vue"

export default {
    data() {
        return {
            fixtureDialog: false,
            tab: 'administrar'
        }
    },
    components: {
        InsertFixtureForm,
        ShowFixtureForm
    },
    emits: ["reload"],
    methods: {
        reload() {
            this.$emit('reload');
        },
        openDialog() {
            this.fixtureDialog = true;
        }
    },
    mounted() {

    }
}
</script>