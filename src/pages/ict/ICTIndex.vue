<template>
    <q-page class="q-pa-md">
        <div class="row q-py-lg">
            <week-activations />
        </div>
        <div class="row q-py-lg">
            <yield-visualization />
        </div>
    </q-page>

</template>

<script>
import WeekActivations from './weekActivations.vue';
import YieldVisualization from './yieldVisualization.vue';

/* Imports */

export default {
    data() {
        return {
        }
    },
    components: {
        WeekActivations,
        YieldVisualization
    },
    methods: {
    },
    mounted() {
    }
}
</script>