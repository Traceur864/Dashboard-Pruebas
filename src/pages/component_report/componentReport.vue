<template>
    <q-page class="q-pa-md">
        <div class="row q-col-gutter-lg q-pt-md">
            <div class="col-auto">
                <q-badge color="primary" class="text-h6">Componente: {{ name }} </q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="positive" class="text-h6">Media: {{ median }} </q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="black" class="text-h6">Low limit: {{ lLimit }}% </q-badge>
            </div>
            <div class="col-auto">
                <q-badge color="black" class="text-h6">High limit: {{ hLimit }}% </q-badge>
            </div>
        </div>

        <div ref="chartdiv" class="graph"></div>
    </q-page>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { api } from 'boot/axios'

export default {
    data() {
        return {
            helper_series: '',
            helper_pareto: '',
            xAxis: '',
            data: '',
            media: '',
            name: '',
            median: '',
            lLimit: '',
            hLimit: '',
        }
    },
    methods: {
        getData() {
            //TODO: GET CURRENT DATE AND FILTER BY THAT
            api.get('/ict_data/activations/bb/component_report').then(response => {
                // this.data = response.data[0];
                var data = response.data[0]
                var media = response.data[1]

                var counter = 1
                data.forEach(element => {
                    element.MSR_V = Number(element.MSR_V.split("V")[0]);
                    element.x = counter
                    counter++
                });

                this.data = data
                this.media = media
                this.name = this.data[0].PART_NAME
                this.lLimit = this.media[0].HLIM
                this.hLimit = this.media[0].LLIM
                this.median = this.media[0].MEDIA

                this.drawChart()

            }).catch(err => {
                console.error(err);
            });
        },
        drawChart() {
            let root = am5.Root.new(this.$refs.chartdiv);

            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            let data = this.data

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            let chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX"
                })
            );

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            let xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererX.new(root, {
                        minGridDistance: 50
                    }),
                    tooltip: am5.Tooltip.new(root, {})
                })
            );

            let yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {})
                })
            );

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            let series = chart.series.push(
                am5xy.LineSeries.new(root, {
                    minBulletDistance: 10,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "MSR_V",
                    valueXField: "x",
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "{MSR_V}"
                    })
                })
            );

            series.strokes.template.setAll({
                strokeWidth: 3
            });

            series.data.setAll(data);

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    sprite: am5.Circle.new(root, {
                        radius: 6,
                        fill: series.get("fill"),
                        stroke: root.interfaceColors.get("background"),
                        strokeWidth: 2
                    })
                });
            });

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                xAxis: xAxis
            }));
            cursor.lineY.set("visible", false);

            // add scrollbar
            chart.set("scrollbarX", am5.Scrollbar.new(root, {
                orientation: "horizontal"
            }));

            chart.set("scrollbarY", am5.Scrollbar.new(root, {
                orientation: "vertical"
            }));

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear(1000, 100);
            chart.appear(1000, 100);

            function createRange(value, endValue, label, color, dashed) {
                let rangeDataItem = yAxis.makeDataItem({
                    value: value,
                    endValue: endValue
                });

                let range = yAxis.createAxisRange(rangeDataItem);

                if (endValue) {
                    range.get("axisFill").setAll({
                        fill: color,
                        fillOpacity: 0.2,
                        visible: true
                    });
                }
                else {
                    range.get("grid").setAll({
                        stroke: color,
                        strokeOpacity: 1,
                        strokeWidth: 2,
                        location: 1
                    });

                    if (dashed) {
                        range.get("grid").set("strokeDasharray", [5, 3]);
                    }
                }

                if (label) {
                    range.get("label").setAll({
                        text: label,
                        location: 1,
                        fontSize: 19,
                        inside: true,
                        centerX: am5.p0,
                        centerY: am5.p100
                    });
                }


            }

            // Function to add process control ranges
            function addLimits(lower, upper, median) {
                // Add range fill
                createRange(lower, upper, undefined, am5.color(0xffce00));

                // Add upper/average/lower lines
                createRange(lower, undefined, "High limit", am5.color(0xD20103));
                createRange(upper, undefined, "Low limit", am5.color(0xD20103));
                createRange(median, undefined, "Comportamiento promedio", am5.color(0x000000), true);

            }
            console.log(Number(this.media[0].MEDIA))


            addLimits(0.7514, 0.4046, this.media[0].MEDIA)
        }
    },
    mounted() {
        this.getData()
        // this.drawChart()
    },
    watch: {
        data_comp: {
            handler() {

            }
        }
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 500px;
}
</style>