<template>
    <div class="col">
        <span class="flex justify-center text-h4">Fallas por tipo de error</span>
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
        <div class="row">
            <div v-for="info in fixtures" v-bind:key="info.FIXTURE_BARCODE" class="col-6 q-px-md">
                <individual-paretto :data="info" />
            </div>
        </div>
    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import { api } from 'boot/axios'
import IndividualParetto from './components/individualParetto.vue';

export default {
    data() {
        return {
            data: [],
            info: [],
            fixtures: [],
            shift: '',
            machine: '',
            model: '',
            start_date: '',
            last_date: '',
            options: [],
        }
    },
    components: {
        IndividualParetto
    },
    methods: {
        getData() {
            api.get('/mda_data/errors/nv_errors').then(response => {
                var data = response.data;

                this.fixtures = new Map()

                data.forEach(dat => {
                    if (!this.fixtures.has(dat.FIXTURE_BARCODE)) {
                        this.fixtures.set(dat.FIXTURE_BARCODE, [])
                    }

                    var temp_data = this.fixtures.get(dat.FIXTURE_BARCODE)
                    temp_data.push(dat)

                    this.fixtures.set(dat.FIXTURE_BARCODE, temp_data)
                });

            }).catch(err => {
                console.error(err);
            });
        },
        filterData(start_date, last_date) {
            api.get('/mda_data/errors/nv_errors/' + start_date + "/" + last_date).then(response => {
                var data = response.data;

                if (data.length > 0) {
                    this.fixtures.clear()

                    data.forEach(dat => {
                        if (!this.fixtures.has(dat.FIXTURE_BARCODE)) {
                            this.fixtures.set(dat.FIXTURE_BARCODE, [])
                        }

                        var temp_data = this.fixtures.get(dat.FIXTURE_BARCODE)
                        temp_data.push(dat)

                        this.fixtures.set(dat.FIXTURE_BARCODE, temp_data)
                    });
                } else {
                    this.$q.notify(
                        {
                            type: 'warning',
                            message: 'No hay información que mostrar',
                            position: 'center',
                            timeout: 3000
                        }
                    )
                }

            }).catch(err => {
                console.error(err);
            });
        }
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
        }
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 400px;
}
</style>