<template>
    <div class="col">
        <span class="flex justify-center text-h4">Activaciones semanales</span>
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
        <div ref="chartContainer">
            <div ref="chartdiv" class="graph"></div>
        </div>
    </div>

</template>

<script>
// Script de opciones del componente

/* Imports */
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { api } from 'boot/axios'

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
            legend: null,
            chart: null,
            root: null,
            xAxis: null,
            yAxis: null,
        }
    },
    methods: {
        getData() {
            api.get('/mda_data/activations').then(response => {
                var data = response.data;

                this.data = new Map()
                this.fixtures = new Map()

                //Format data by fixture and days
                data.forEach(dat => {
                    let info = new Map()

                    info.set(dat.FIXTURE_BARCODE, dat.ACTIVACIONES)

                    this.fixtures.set(dat.FIXTURE_BARCODE, dat.FIXTURE_BARCODE)

                    if (!this.data.has(dat.DATE_TIME.substring(0, 10))) {
                        var temp = []
                        temp.push(info)
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    } else {
                        var temp = this.data.get(dat.DATE_TIME.substring(0, 10))
                        temp.push(info)
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    }
                });

                this.data.forEach((el, key) => {
                    var info = {}
                    info.DATE_TIME = key
                    el.forEach(dat => {
                        var temp = Array.from(dat)
                        info[temp[0][0]] = temp[0][1]
                    });
                    this.info.push(info)
                });

                this.drawChart();
            }).catch(err => {
                console.error(err);
            });
        },
        filterData(start_date, last_date) {
            api.get('/mda_data/activations/' + start_date + "/" + last_date).then(response => {
                var data = response.data

                this.data = new Map()
                this.fixtures = new Map()

                data.forEach(dat => {
                    let info = new Map()

                    info.set(dat.FIXTURE_BARCODE, dat.ACTIVACIONES)

                    this.fixtures.set(dat.FIXTURE_BARCODE, dat.FIXTURE_BARCODE)

                    if (!this.data.has(dat.DATE_TIME.substring(0, 10))) {
                        var temp = []
                        temp.push(info)
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    } else {
                        var temp = this.data.get(dat.DATE_TIME.substring(0, 10))
                        temp.push(info)
                        this.data.set(dat.DATE_TIME.substring(0, 10), temp);
                    }
                });

                this.data.forEach((el, key) => {
                    var info = {}
                    info.DATE_TIME = key
                    el.forEach(dat => {
                        var temp = Array.from(dat)
                        info[temp[0][0]] = temp[0][1]
                    });
                    this.info.push(info)
                });

                if (this.data.size > 0) {
                    // this.reDrawChart(this.root)
                }
            }).catch(err => {
                console.error(err);
            });
        },
        reDrawChart(root) {
            //Clear chart
            this.xAxis.data.clear()
            this.legend.data.clear()

            let xAxis = this.xAxis
            let yAxis = this.yAxis

            this.chart.series._values.forEach(element => {
                console.log(element);
            });

            this.root.dispose()

            this.drawChart()
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

            let data = this.info

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
                    categoryXField: "DATE_TIME"
                }));

                series.columns.template.setAll({
                    tooltipText: "Fixtura: {name}, Activaciones: {valueY}",
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
                makeSeries(el, el);
            });

            //Reduce lag
            // root.fps = 60    

            // Make stuff animate on load
            chart.appear(1000, 100);
            this.legend = legend;
            this.chart = chart;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.root = root;
        }
    },
    mounted() {
        this.getData()
    },
    watch: {
        start_date: {
            handler() {
                // Validate that both variables are not empty
                if (this.last_date != "" && this.start_date != "") {
                    //Validate that start date is smaller than last date
                    if (this.start_date <= this.last_date) {
                        this.filterData(this.start_date, this.last_date)
                    }
                }
            }
        },
        last_date: {
            handler() {
                // Validate that both variables are not empty
                if (this.last_date != "" && this.start_date != "") {
                    //Validate that start date is smaller than last date
                    if (this.start_date <= this.last_date) {
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