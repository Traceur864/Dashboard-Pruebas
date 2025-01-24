<template>
    <div class="row q-col-gutter-md q-pt-md">
        <div class="col-auto">
            <q-badge color="primary" class="text-h6">Día: {{ data.DATE_TIME.split("T")[0] }} </q-badge>
        </div>
    </div>
    <div ref="yield" class="graph"></div>
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
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
                value: this.data.PASS,
            },
            {
                category: "Fallas",
                value: this.data.FAIL,
            }]);

            // Make stuff animate on load
            chart.appear(1000, 100);

            this.helper = series
        }
    },
    mounted() {
        this.drawChart()
    },
    watch: {
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
    }
}
</script>

<style scoped>
.graph {
    width: 100%;
    height: 200px;
}
</style>