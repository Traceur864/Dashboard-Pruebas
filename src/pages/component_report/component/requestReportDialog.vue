<template>
    <q-dialog v-model="requestDialog">
        <q-card style="width: 250vh;">
            <q-card-section class="items-center">
                <span class="text-h6">Solicitar reporte</span>
                <hr>
                <div class="row q-pb-md">
                    <div class="col">
                        <q-input v-model="atm_name" square filled type="text" label="Nombre del componente"
                            hint="Cuida no agregar espacios extra al incio y al final del nombre" />
                    </div>
                </div>
                <div class="row q-col-gutter-x-sm">
                    <div class="col">
                        <q-input square filled v-model="atm_name" type="date" label="Fecha de inicio" />
                    </div>
                    <div class="col">
                        <q-input square filled v-model="atm_name" type="date" label="Fecha de fin" />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="dark" @click="requestDialog = false" />
                <q-btn label="Solicitar" color="positive" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    data() {
        return {
            requestDialog: false,
            atm_name: ''
        }
    },
    methods: {
        openDialog() {
            this.requestDialog = true;
        }
    },

}
</script>