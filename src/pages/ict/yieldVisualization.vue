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
            <div class="col-3">
                <q-select v-model="model" :options="options" label="Modelo" filled />
            </div>
        </div>
        <div class="row q-col-gutter-md q-pt-md">
            <div class="col-auto">
                <q-badge color="primary" class="text-h6">Total de pases: {{ data.pass }} </q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="primary" class="text-h6">Total de fallas: {{ data.fail }}</q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="primary" class="text-h6">Total de unidades: {{ data.total }}</q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="primary" class="text-h6">Yield: {{ data.Yield }}%</q-badge>
            </div>
        </div>
        <div ref="yield" class="graph"></div>
    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { data } from "autoprefixer";
import { api } from 'boot/axios'

export default {
    data() {
        return {
            data: [],
            info: [],
            fixtures: [],
            shift: null,
            machine: '',
            model: '',
            date: '',
            chart: null,
            options: [],
        }
    },
    methods: {
        getData() {
            //TODO: GET CURRENT DATE AND FILTER BY THAT
            api.get('/ict_data/errors/bb/yield/2024-11-11/null').then(response => {
                this.data = response.data[0][0];

                this.drawChart();
            }).catch(err => {
                console.error(err);
            });
        },
        filterData() {
            api.get('/ict_data/errors/bb/yield/' + this.date + '/' + this.shift).then(response => {
                this.data = response.data[0][0];
                this.chart.series.data.setIndex(0, {
                    category: "Pases",
                    value: this.data.pass
                })
                this.chart.series.data.setIndex(1, {
                    category: "Fallas",
                    value: this.data.fail
                })
                // this.drawChart();
            }).catch(err => {
                console.error(err);
            });
        },
        drawChart() {
            /* Chart code */
            // Create root element
            let root = am5.Root.new(this.$refs.yield);

            // Set themes
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            let chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    endAngle: 270
                })
            );

            // Create series
            let series = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "value",
                    categoryField: "category",
                    color: "color",
                    endAngle: 270
                })
            );

            series.get('colors').set('colors', [
                am5.color(0x50b300),
                am5.color(0xb30000)
            ])


            series.states.create("hidden", {
                endAngle: -90
            });

            series.data.setAll([{
                category: "Pases",
                value: this.data.pass,
            },
            {
                category: "Fallas",
                value: this.data.fail,
            }]);

            // Make stuff animate on load
            chart.appear(1000, 100);

            this.chart = chart
        }
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

<style scoped>
.graph {
    width: 100%;
    height: 400px;
}
</style>