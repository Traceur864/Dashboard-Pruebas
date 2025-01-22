<template>
    <div class="col">
        <span class="flex justify-center text-h4">First Pass Yield</span>
        <div class="row">
            <div class="col-auto">
                <div class="text-h6">Filtros</div>
            </div>
        </div>
        <div class="row q-col-gutter-sm">
            <div class="col-3">
                <q-input v-model="date" type="date" label="Fecha del Yield" filled />
            </div>
            <div class="col-3">
                <q-select v-model="shift" :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" filled>
                    <template v-slot:append>
                        <q-icon v-if="shift !== null" class="cursor-pointer" name="clear"
                            @click.stop.prevent="shift = null" />
                    </template>
                </q-select>
            </div>
        </div>

        <div v-for="info in data" v-bind:key="info.FIXTURE" class="col-6">
            <YieldWeek :data="info" />
        </div>

    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import { api } from 'boot/axios'
import YieldWeek from './components/yield/yieldWeek.vue';

export default {
    data() {
        return {
            data: [],
            info: [],
            fixtures: [],
            shift: null,
            machine: '',
            model: null,
            date: '',
            options: [],
        }
    },
    components: {
        YieldWeek
    },
    methods: {
        getData() {
            //TODO: GET CURRENT DATE AND FILTER BY THAT
            api.get('/mda_data/errors/week_yield').then(response => {
                // this.data = response.data[0];
                var data = response.data[0]
                this.data = new Map()

                // console.log(data);
                data.forEach(dat => {
                    if (this.data.has(dat.FIXTURE)) {
                        var temp = this.data.get(dat.FIXTURE)
                        temp.push(dat)
                        this.data.set(dat.FIXTURE, temp);
                    } else {
                        this.data.set(dat.FIXTURE, [dat]);
                    }
                });

            }).catch(err => {
                console.error(err);
            });
        },
        filterData() {
            api.get('/mda_data/errors/week_yield').then(response => {
                this.data = []
                this.data = response.data[0];
                // this.drawChart();
            }).catch(err => {
                console.error(err);
            });
        },
    },
    mounted() {
        this.getData()
    },
    watch: {
        date: {
            handler() {
                this.filterData();
            }
        },
        shift: {
            handler() {
                if (this.date != '') {
                    this.filterData();
                } else if (this.shift != '') {
                    this.$q.notify({
                        message: 'Debe seleccionar una fecha',
                        type: 'warning',
                        timeout: 1000
                    })
                }
            }
        }
    },
}
</script>