<template>
    <q-page class="q-pa-md">
        <span class="flex justify-center text-h4">Frecuencia de errores</span>
        <div class="row">
            <div class="col-auto">
                <div class="text-h6">Filtros</div>
            </div>
        </div>
        <div class="row q-col-gutter-sm">
            <div class="col">
                <q-select v-model="machine" :options="options" label="Tester" filled />
            </div>
            <div class="col">
                <q-select v-model="model" :options="options" label="Modelo" filled />
            </div>
            <div class="col">
                <q-input v-model="date" type="date" label="Fecha" filled />
            </div>
        </div>
        <div ref="chartdiv" class="graph"></div>
    </q-page>

</template>

<script>
// Script de opciones del componente

/* Imports */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { api } from 'boot/axios'

export default {
    name: "ICT",
    data() {
        return {
            data: [],
            fixtures: [],
            shift: '',
            machine: '',
            model: '',
            date: '',
            options: [],
        }
    },
    methods: {
        getData() {
            api.get('/ict_data/activations/bb').then(response => {
                var data = response.data;
                this.data = new Map()

                data.forEach(dat => {
                    let info =
                    {
                        FIXTURE_BARCODE: dat.FIXTURE_BARCODE,
                        DATE_TIME: dat.DATE_TIME.substring(0, 10),
                        TOTAL_UNITS: dat.TOTAL_UNITS,
                        ACTIVACIONES: dat.ACTIVACIONES
                    }

                    if (!this.data.has(dat.DATE_TIME.substring(0, 10))) {
                        var temp = []
                        temp.push(info)
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    } else {
                        var temp = this.data.get(dat.DATE_TIME.substring(0, 10))
                        temp.push(info)
                        console.log(temp);
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    }
                });

                this.fixtures = Array.from(this.data.keys());

                this.drawChart();
            });
        },
        drawChart() {
            // Create root element
            let root = am5.Root.new(this.$refs.chartdiv);

            // Set themes
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                paddingLeft: 0,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout
            }));


            // Add legend
            let legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50
                })
            );

            let data = this.data
            console.log(this.data, Array.from(this.fixtures.keys()));

            // Create axes
            let xRenderer = am5xy.AxisRendererX.new(root, {
                cellStartLocation: 0.1,
                cellEndLocation: 0.9,
                minorGridEnabled: true
            })

            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "DATE_TIME",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xAxis.data.setAll(data);

            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            // Add series
            function makeSeries(name, fieldName) {
                let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    categoryXField: "FIXTURE_BARCODE"
                }));

                series.columns.template.setAll({
                    tooltipText: "Fixtura: {FIXTURE_BARCODE}, Activaciones: {valueY}, Fecha: {DATE_TIME}",
                    width: am5.percent(90),
                    tooltipY: 0,
                    strokeOpacity: 0
                });

                series.data.setAll(data);

                // Make stuff animate on load
                series.appear();

                series.bullets.push(function () {
                    return am5.Bullet.new(root, {
                        locationY: 0,
                        sprite: am5.Label.new(root, {
                            text: "{valueY}",
                            fill: root.interfaceColors.get("alternativeText"),
                            centerY: 0,
                            centerX: am5.p50,
                            populateText: true
                        })
                    });
                });

                legend.data.push(series);
            }


            this.fixtures.forEach(el => {
                makeSeries(el, "ACTIVACIONES")
            });

            // Make stuff animate on load
            chart.appear(1000, 100);
        }
    },
    mounted() {
        this.getData()
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 700px;
}
</style>