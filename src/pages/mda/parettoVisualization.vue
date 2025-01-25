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
            <div class="col-8">
                <div class="row q-col-gutter-md q-pt-md">
                    <div class="col-6">
                        <q-badge color="primary" class="text-h6">Información semanal</q-badge>
                    </div>
                </div>
                <div ref="chartdiv" class="graph"></div>
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
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

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
        getWeekData() {
            api.get('/mda_data/errors/nv_errors/week').then(response => {
                var data = response.data;
                this.week = data;
                this.drawChart()

            }).catch(err => {
                console.error(err);
            });
        },
        filterData(start_date, last_date) {
            api.get('/mda_data/errors/nv_errors/' + start_date + "/" + last_date).then(response => {
                var data = response.data;

                if (data[0].length > 0) {
                    this.week = data[1]
                    this.updatChart()
                    this.fixtures.clear()

                    data[0].forEach(dat => {
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
        },
        updatChart() {
            let data = this.week;

            prepareParetoData();

            function prepareParetoData() {
                let total = 0;

                for (var i = 0; i < data.length; i++) {
                    let value = data[i].TOTAL;
                    total += value;
                }

                let sum = 0;
                for (var i = 0; i < data.length; i++) {
                    let value = data[i].TOTAL;
                    sum += value;
                    data[i].pareto = sum / total * 100;
                }
            }

            this.helper_series.data.clear();
            this.helper_pareto.data.clear();
            this.xAxis.data.clear();
            this.helper_series.data.setAll(data);
            this.helper_pareto.data.setAll(data);
            this.xAxis.data.setAll(data);
        },
        drawChart() {
            let root = am5.Root.new(this.$refs.chartdiv);

            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                paddingLeft: 0,
                paddingRight: 0,
                layout: root.verticalLayout
            }));

            chart.set("scrollbarX", am5.Scrollbar.new(root, {
                orientation: "horizontal"
            }));

            let colors = chart.get("colors");

            let data = this.week;

            prepareParetoData();

            function prepareParetoData() {
                let total = 0;

                for (var i = 0; i < data.length; i++) {
                    let value = data[i].TOTAL;
                    total += value;
                }

                let sum = 0;
                for (var i = 0; i < data.length; i++) {
                    let value = data[i].TOTAL;
                    sum += value;
                    data[i].pareto = sum / total * 100;
                }
            }

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            let xRenderer = am5xy.AxisRendererX.new(root, {
                minGridDistance: 20,
                minorGridEnabled: true
            })

            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "ERROR_DESC",
                renderer: xRenderer
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xRenderer.labels.template.setAll({
                rotation: 90
            });

            xAxis.data.setAll(data);

            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            let paretoAxisRenderer = am5xy.AxisRendererY.new(root, { opposite: true });
            let paretoAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: paretoAxisRenderer,
                min: 0,
                max: 100,
                strictMinMax: true
            }));

            paretoAxisRenderer.grid.template.set("forceHidden", true);
            paretoAxis.set("numberFormat", "#'%");

            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "TOTAL",
                categoryXField: "ERROR_DESC"
            }));

            series.columns.template.setAll({
                tooltipText: "{categoryX}: {valueY}",
                tooltipY: 0,
                strokeOpacity: 0,
                cornerRadiusTL: 6,
                cornerRadiusTR: 6
            });

            series.columns.template.adapters.add("fill", function (fill, target) {
                return chart.get("colors").getIndex(series.dataItems.indexOf(target.dataItem));
            })

            // pareto series
            let paretoSeries = chart.series.push(am5xy.LineSeries.new(root, {
                xAxis: xAxis,
                yAxis: paretoAxis,
                valueYField: "pareto",
                categoryXField: "ERROR_DESC",
                stroke: root.interfaceColors.get("alternativeBackground"),
                maskBullets: false
            }));

            paretoSeries.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 1,
                    sprite: am5.Circle.new(root, {
                        radius: 5,
                        fill: series.get("fill"),
                        stroke: root.interfaceColors.get("alternativeBackground")
                    })
                })
            })

            series.data.setAll(data);
            paretoSeries.data.setAll(data);

            // Make stuff animate on load
            series.appear();
            chart.appear(1000, 100);

            this.helper_series = series
            this.helper_pareto = paretoSeries
            this.xAxis = xAxis
        }
    },
    mounted() {
        this.getData()
        this.getWeekData()
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
    height: 450px;
}
</style>