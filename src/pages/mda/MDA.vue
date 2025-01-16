<template>
    <q-page class="q-pa-md">
        <div class="row q-py-lg">
            <WeekActivations />
        </div>
        <div class="row q-py-lg">
            <YieldVisualization />
        </div>
        <div class="row q-py-lg">
            <ParettoVisualization />
        </div>
        <div class="row q-py-lg">
            <ComponentVisualization />
        </div>
        <div class="row q-py-lg">
            <RetestVisualization />
        </div>
        <div class="row q-py-lg">

        </div>
    </q-page>
</template>

<script>
import ComponentVisualization from './componentVisualization.vue';
import ParettoVisualization from './parettoVisualization.vue';
import RetestVisualization from './retestVisualization.vue';
import WeekActivations from './weekActivations.vue';
import YieldVisualization from './yieldVisualization.vue';

export default {
    name: 'MDA',
    data() {
    },
    components: {
        WeekActivations,
        YieldVisualization,
        ParettoVisualization,
        ComponentVisualization,
        RetestVisualization
    },
    methods: {

    },
    mounted() {

    }
};
</script>