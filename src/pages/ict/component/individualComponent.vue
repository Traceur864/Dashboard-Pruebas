<template>
    <div class="row q-col-gutter-md q-pt-md">
        <div class="col-auto">
            <q-badge color="primary" class="text-h6">Fixtura: {{ data[0] }} </q-badge>
        </div>
    </div>
    <div ref="chartdiv" class="graph"></div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { data } from "autoprefixer";

export default {
    data() {
        return {
            helper: ''
        }
    },
    props: ['data'],
    methods: {
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

            let data = this.data[1];

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
                minGridDistance: 15,
                minorGridEnabled: true
            })

            let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "FAILURE",
                renderer: xRenderer
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xRenderer.labels.template.setAll({
                rotation: -90
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


            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "TOTAL",
                categoryXField: "FAILURE"
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
                categoryXField: "FAILURE",
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

        }
    },
    mounted() {
        this.drawChart()
        console.log(this.data);
    },
    /*watch: {
        data: {
            handler() {
                this.helper.data.clear()

                this.helper.data.setAll([{
                    category: "Pases",
                    value: this.data.PASS,
                },
                {
                    category: "Fallas",
                    value: this.data.FAIL,
                }])

            }
        }
    }*/
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 800px;
}
</style>