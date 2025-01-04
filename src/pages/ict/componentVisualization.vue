<template>
    <div class="col">
        <span class="flex justify-center text-h4">Fallas por componente</span>
        <div class="row">
            <div class="col-auto">
                <div class="text-h6">Filtro por rango de fecha</div>
            </div>
        </div>
        <div class="row q-col-gutter-sm">
            <div class="col-3">
                <q-input v-model="date" type="date" label="Inicio" filled />
            </div>
            <div class="col-3">
                <q-input v-model="date" type="date" label="Fin" filled />
            </div>
        </div>
        <div v-for="info in data" v-bind:key="info.FIXTURE_BARCODE" class="col-6">
            <individual-component :data="info" />
        </div>
    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import { api } from 'boot/axios'
import IndividualComponent from './component/individualComponent.vue';

export default {
    data() {
        return {
            data: [],
            info: [],
            fixtures: [],
            shift: '',
            machine: '',
            model: '',
            date: '',
            options: [],
        }
    },
    components: {
        IndividualComponent
    },
    methods: {
        getData() {
            api.get('/ict_data/errors/bb/component_error').then(response => {
                var data = response.data;
                // console.log(data);

                this.data = new Map()

                data.general_f.forEach(dat => {
                    if (!this.data.has(dat.FIXTURE_BARCODE)) {
                        this.data.set(dat.FIXTURE_BARCODE, [])
                    }

                    var temp_data = this.data.get(dat.FIXTURE_BARCODE)
                    temp_data.push(dat)

                    this.data.set(dat.FIXTURE_BARCODE, temp_data)
                });

                data.short_f.forEach(dat => {
                    if (!this.data.has(dat.FIXTURE_BARCODE)) {
                        this.data.set(dat.FIXTURE_BARCODE, [])
                    }

                    var temp_data = this.data.get(dat.FIXTURE_BARCODE)
                    temp_data.push(dat)

                    this.data.set(dat.FIXTURE_BARCODE, temp_data)
                });

            }).catch(err => {
                console.error(err);
            });
        },
    },
    mounted() {
        this.getData()
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 400px;
}
</style>