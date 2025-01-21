<template>
    <div class="col">
        <span class="flex justify-center text-h4">Reportes de utilización</span>
        <div class="row">
            <div class="col-auto">
                <div class="text-h6">Filtro por rango de fecha</div>
            </div>
        </div>
        <div class="row q-col-gutter-sm">
            <div class="col-3">
                <q-input v-model="start_date" type="date" label="Fecha de inicio" filled />
            </div>
            <div class="col-3">
                <q-input v-model="end_date" type="date" label="Fecha de fin" filled />
            </div>
        </div>

        <div class="row">
            <div v-for="info in fixtures" v-bind:key="info.FIXTURE_BARCODE" class="col-6">
                <IndividualUtilization :data="info" />
            </div>
        </div>

    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import { api } from 'boot/axios'
import IndividualUtilization from './components/individualUtilization.vue';

export default {
    data() {
        return {
            data: [],
            info: [],
            fixtures: [],
            shift: null,
            machine: '',
            model: null,
            start_date: '',
            end_date: '',
            options: [],
        }
    },
    components: {
        IndividualUtilization
    },
    methods: {
        getData() {
            this.data = new Map()
            this.fixtures = new Map()
            //TODO: GET CURRENT DATE AND FILTER BY THAT
            api.get('/mda_data/activations/utilization').then(response => {
                this.data = response.data[0];

                this.data.forEach(info => {
                    var dt = new Date(info.DATE_TIME)

                    let temp = {
                        'DATE': dt.getTime(),
                        'DAY': dt.toLocaleDateString(),
                        'OEE': Number(info.OEE),
                        'YIELD': Number(info.YIELD),
                        'UTILIZATION': Number(info.Utilization),
                    }

                    if (!this.fixtures.has(info.FIXTURE_BARCODE)) {
                        //Append data to map
                        this.fixtures.set(info.FIXTURE_BARCODE, [temp]);
                    } else {
                        //Push data to existing array
                        var helper = this.fixtures.get(info.FIXTURE_BARCODE)
                        helper.push(temp);
                        this.fixtures.set(info.FIXTURE_BARCODE, helper);
                    }

                });


            }).catch(err => {
                console.error(err);
            });
        },
        filterData() {
            api.get('/mda_data/activations/utilization/' + this.start_date + '/' + this.end_date).then(response => {
                var data = response.data[0];

                if (data.length > 0) {
                    this.fixtures.clear()

                    data.forEach(info => {
                        var dt = new Date(info.DATE_TIME)

                        let temp = {
                            'DATE': dt.getTime(),
                            'DAY': dt.toLocaleDateString(),
                            'OEE': Number(info.OEE),
                            'YIELD': Number(info.YIELD),
                            'UTILIZATION': Number(info.Utilization),
                        }

                        if (!this.fixtures.has(info.FIXTURE_BARCODE)) {
                            //Append data to map
                            this.fixtures.set(info.FIXTURE_BARCODE, [temp]);
                        } else {
                            //Push data to existing array
                            var helper = this.fixtures.get(info.FIXTURE_BARCODE)
                            helper.push(temp);
                            this.fixtures.set(info.FIXTURE_BARCODE, helper);
                        }
                    });

                } else {
                    this.$q.notify({
                        type: 'negative',
                        message: 'No hay información dentro de los rangos de fecha seleccionados'
                    })
                }

            }).catch(err => {
                console.error(err);
                this.$q.notify({
                    type: 'negative',
                    message: 'No hay información que mostrar dentro de los rangos de fecha seleccionados'
                })
            });
        },
    },
    mounted() {
        this.getData()
    },
    watch: {
        start_date: {
            handler() {
                if (this.start_date != '' && this.end_date != '') {
                    if (this.end_date < this.start_date) {
                        this.$q.notify({
                            type: 'negative',
                            message: 'La Fecha de fin debe ser mayor a la fecha de inicio'
                        })
                    }
                    this.filterData();
                }
            }
        },
        end_date: {
            handler() {
                if (this.start_date != '' && this.end_date != '') {
                    if (this.end_date < this.start_date) {
                        this.$q.notify({
                            type: 'negative',
                            position: 'center',
                            message: 'La Fecha de fin debe ser mayor a la fecha de inicio'
                        })
                    }
                    this.filterData();
                }
            }
        }
    },
}
</script>