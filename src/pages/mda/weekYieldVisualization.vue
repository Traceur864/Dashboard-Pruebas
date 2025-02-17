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
                <q-input v-model="start_date" type="date" label="Fecha de inicio" filled />
            </div>
            <div class="col-3">
                <q-input v-model="end_date" type="date" label="Fecha del fin" filled />
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
            start_date: '',
            end_date: '',
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
            api.get('/mda_data/errors/week_yield/' + this.start_date + "/" + this.end_date).then(response => {
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
        start_date: {
            handler() {
                if (this.start_date != "" && this.end_date != "" && this.start_date <= this.end_date) {
                    this.filterData();
                } else if (this.start_date == "" && this.end_date == "") {
                    this.getData();
                }
            }
        },
        end_date: {
            handler() {
                if (this.start_date != "" && this.end_date != "" && this.start_date <= this.end_date) {
                    this.filterData();
                } else if (this.start_date == "" && this.end_date == "") {
                    this.getData();
                }
            }
        }
    },
}
</script>