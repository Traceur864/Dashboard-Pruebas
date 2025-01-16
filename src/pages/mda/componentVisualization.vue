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
                <q-input v-model="start_date" type="date" label="Inicio" filled />
            </div>
            <div class="col-3">
                <q-input v-model="last_date" type="date" label="Fin" filled />
            </div>
        </div>
        <div v-for="info in fixtures" v-bind:key="info.FIXTURE_BARCODE" class="col-6">
            <individual-component :data_comp="info" />
        </div>
    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import { api } from 'boot/axios'
import IndividualComponent from './components/individualComponent.vue';

export default {
    data() {
        return {
            info: [],
            fixtures: [],
            shift: '',
            machine: '',
            model: '',
            prueba: '',
            start_date: '',
            last_date: '',
            options: [],
        }
    },
    components: {
        IndividualComponent
    },
    methods: {
        getData() {
            api.get('/mda_data/errors/component_error').then(response => {
                var data = response.data;

                if (data.length > 0) {
                    this.fixtures = new Map()

                    data.forEach(dat => {
                        if (!this.fixtures.has(dat.FIXTURE_BARCODE)) {
                            this.fixtures.set(dat.FIXTURE_BARCODE, [])
                        }

                        var temp_data = this.fixtures.get(dat.FIXTURE_BARCODE)
                        temp_data.push(dat)

                        this.fixtures.set(dat.FIXTURE_BARCODE, temp_data)
                    });
                }

            }).catch(err => {
                console.error(err);
            });
        },
        filterData(start_date, last_date) {
            api.get('/mda_data/errors/component_error/' + start_date + "/" + last_date).then(response => {
                var data = response.data;

                if (data.length > 0) {

                    this.fixtures = new Map()

                    data.forEach(dat => {
                        if (!this.fixtures.has(dat.FIXTURE_BARCODE)) {
                            this.fixtures.set(dat.FIXTURE_BARCODE, [])
                        }

                        var temp_data = this.fixtures.get(dat.FIXTURE_BARCODE)
                        temp_data.push(dat)

                        this.fixtures.set(dat.FIXTURE_BARCODE, temp_data)
                    });
                }

            }).catch(err => {
                console.error(err);
            });
        },
    },
    mounted() {
        this.getData()
    },
    watch: {
        start_date: {
            handler() {
                if (this.start_date != "" && this.last_date != "") {
                    if (this.start_date <= this.last_date && this.last_date != "") {
                        this.filterData(this.start_date, this.last_date)
                    }
                }
            }
        },
        last_date: {
            handler() {
                if (this.start_date != "" && this.last_date != "") {
                    if (this.start_date <= this.last_date && this.last_date != "") {
                        this.filterData(this.start_date, this.last_date)
                    }
                }
            }
        },
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 400px;
}
</style>