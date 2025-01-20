<template>
    <div class="row q-col-gutter-md q-pt-md">
        <div class="col-auto">
            <q-badge color="orange" text-color="black" class="text-h6">Fixtura: {{ data[0] }} </q-badge>
        </div>
    </div>
    <div ref="input" class="graph"></div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
    data() {
        return {
            helper: '',
            helper_out: '',
            helper_utilizaton: '',
        }
    },
    props: ['data'],
    methods: {
        drawChart() {
            let root = am5.Root.new(this.$refs.input);

            const myTheme = am5.Theme.new(root);

            myTheme.rule("AxisLabel", ["minor"]).setAll({
                dy: 1
            });

            myTheme.rule("Grid", ["x"]).setAll({
                strokeOpacity: 0.05
            });

            myTheme.rule("Grid", ["x", "minor"]).setAll({
                strokeOpacity: 0.05
            });

            // Set themes
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            let chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                maxTooltipDistance: 0,
                pinchZoomX: true
            }));

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
                maxDeviation: 0.2,
                baseInterval: {
                    timeUnit: "day",
                    count: 1
                },
                renderer: am5xy.AxisRendererX.new(root, {
                    minorGridEnabled: true
                }),
                tooltip: am5.Tooltip.new(root, {})
            }));

            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            }));

            // Add series
            let series = chart.series.push(am5xy.LineSeries.new(root, {
                name: "OEE",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "OEE",
                valueXField: "DATE",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "OEE: {OEE}%, FECHA: {DAY}"
                })
            }));

            series.data.setAll(this.data[1]);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            let yield_series = chart.series.push(am5xy.LineSeries.new(root, {
                name: "YIELD",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "YIELD",
                valueXField: "DATE",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "YIELD: {YIELD}%, FECHA: {DAY}"
                })
            }));

            yield_series.data.setAll(this.data[1]);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            yield_series.appear();

            let utilization_series = chart.series.push(am5xy.LineSeries.new(root, {
                name: "Utilización",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "UTILIZATION",
                valueXField: "DATE",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "Utilización: {UTILIZATION}%, FECHA: {DAY}"
                })
            }));

            utilization_series.data.setAll(this.data[1]);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            utilization_series.appear();

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none"
            }));
            cursor.lineY.set("visible", false);


            // Add scrollbar
            // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
            chart.set("scrollbarX", am5.Scrollbar.new(root, {
                orientation: "horizontal"
            }));

            // Add legend
            // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
            let legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
                width: 200,
                paddingLeft: 15,
                height: am5.percent(100)
            }));

            // When legend item container is hovered, dim all the series except the hovered one
            legend.itemContainers.template.events.on("pointerover", function (e) {
                let itemContainer = e.target;

                // As series list is data of a legend, dataContext is series
                let series = itemContainer.dataItem.dataContext;

                chart.series.each(function (chartSeries) {
                    if (chartSeries != series) {
                        chartSeries.strokes.template.setAll({
                            strokeOpacity: 0.15,
                        });
                    } else {
                        chartSeries.strokes.template.setAll({
                            strokeWidth: 3
                        });
                    }
                })
            })

            // When legend item container is unhovered, make all series as they are
            legend.itemContainers.template.events.on("pointerout", function (e) {
                let itemContainer = e.target;
                let series = itemContainer.dataItem.dataContext;

                chart.series.each(function (chartSeries) {
                    chartSeries.strokes.template.setAll({
                        strokeOpacity: 1,
                        strokeWidth: 1
                    });
                });
            })

            legend.itemContainers.template.set("width", am5.p100);
            legend.valueLabels.template.setAll({
                width: am5.p100,
                textAlign: "right"
            });

            // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
            legend.data.setAll(chart.series.values);

            series.set("stroke", am5.color("#FF9800"))
            yield_series.set("stroke", am5.color("#4CAF50"))
            utilization_series.set("stroke", am5.color("#607D8B"))

            // Make stuff animate on load
            chart.appear(1000, 100);

            this.helper = series
            this.helper_out = yield_series
            this.helper_utilizaton = utilization_series
        }
    },
    mounted() {
        this.drawChart()
    },
    watch: {
        data: {
            handler() {
                let data = this.data[1]

                this.helper.data.clear()
                this.helper_out.data.clear()
                this.helper_utilizaton.data.clear()

                this.helper.data.setAll(data)
                this.helper_out.data.setAll(data)
                this.helper_utilizaton.data.setAll(data)
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