<template>
    <div ref="chartdiv" class="graph"></div>
</template>

<script>
export default {
    methods: {
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

            // Make stuff animate on load
            chart.appear(1000, 100);

            this.helper = chart;
            this.root = root;
        }
    }
}
</script>