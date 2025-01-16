<template>
    <q-page class="q-pa-md">
        <div class="row q-py-lg">
            <week-activations />
        </div>
        <div class="row q-py-lg">
            <yield-visualization />
        </div>
        <div class="row q-py-lg">
            <paretto-visualization />
        </div>
        <div class="row q-py-lg">
            <component-visualization />
        </div>
        <div class="row q-py-lg">
            <RetestVisualization />
        </div>
    </q-page>

</template>

<script>
import WeekActivations from './weekActivations.vue';
import YieldVisualization from './yieldVisualization.vue';
import parettoVisualization from './parettoVisualization.vue';
import ComponentVisualization from './componentVisualization.vue';
import RetestVisualization from './retestVisualization.vue';

/* Imports */

export default {
    data() {
        return {
        }
    },
    components: {
        WeekActivations,
        YieldVisualization,
        parettoVisualization,
        ComponentVisualization,
        RetestVisualization
    },
    methods: {
    },
    mounted() {
    }
}
</script>