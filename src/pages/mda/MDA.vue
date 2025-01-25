<template>
    <q-page class="q-pa-md">
        <div class="row q-py-lg">
            <WeekActivations />
        </div>
        <hr>
        <div class="row q-py-lg">
            <YieldVisualization />
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
            <ParettoVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <ComponentVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <RetestVisualization />
        </div>
    </q-page>
</template>

<script>
import ComponentVisualization from './componentVisualization.vue';
import Input_outputVisualization from './input_outputVisualization.vue';
import ParettoVisualization from './parettoVisualization.vue';
import RetestVisualization from './retestVisualization.vue';
import UtilizationVisualization from './utilizationVisualization.vue';
import WeekActivations from './weekActivations.vue';
import YieldVisualization from './weekYieldVisualization.vue';

export default {
    name: 'MDA',
    data() {
    },
    components: {
        WeekActivations,
        YieldVisualization,
        ParettoVisualization,
        ComponentVisualization,
        RetestVisualization,
        Input_outputVisualization,
        UtilizationVisualization
    },
    methods: {

    },
    mounted() {

    }
};
</script>