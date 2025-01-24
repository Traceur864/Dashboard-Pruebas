<template>
    <q-page class="q-pa-md">
        <div class="row q-py-lg">
            <week-activations />
        </div>
        <hr>
        <div class="row q-py-lg">
            <!-- <yield-visualization /> -->
            <WeekYieldVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <Input_outputVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <UtilizationVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <paretto-visualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <component-visualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <RetestVisualization />
        </div>
    </q-page>

</template>

<script>
import WeekActivations from './weekActivations.vue';
// import YieldVisualization from './yieldVisualization.vue';
import parettoVisualization from './parettoVisualization.vue';
import ComponentVisualization from './componentVisualization.vue';
import RetestVisualization from './retestVisualization.vue';
import Input_outputVisualization from './input_outputVisualization.vue';
import UtilizationVisualization from './utilizationVisualization.vue';
import WeekYieldVisualization from './weekYieldVisualization.vue';
/* Imports */

export default {
    data() {
        return {
        }
    },
    components: {
        WeekActivations,
        WeekYieldVisualization,
        // YieldVisualization,
        parettoVisualization,
        ComponentVisualization,
        RetestVisualization,
        Input_outputVisualization,
        UtilizationVisualization
    },
    methods: {
    },
    mounted() {
    }
}
</script>