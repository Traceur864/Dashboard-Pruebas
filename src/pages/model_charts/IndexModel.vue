<template>
    <q-page class="q-pa-md">
        <div class="column">
            <div class="col-auto self-center">
                <h4 class="text-bold">Reportes Modelo: {{ $route.params.model }}</h4>
            </div>
        </div>
        <div class="row q-py-lg">
            <week-activations />
        </div>
        <hr>
        <div class="row q-py-lg">
            <YieldVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <input_outputVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <UtilizationVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <UtilizationVisualization />
        </div>
        <hr>
        <div class="row q-py-lg">
            <NVErrors />
        </div>
        <hr>
        <div class="row q-py-lg">
            <ComponentVisualization />
        </div>
        <hr>
    </q-page>
</template>
<script>
import input_outputVisualization from './component/input_outputVisualization.vue';
import UtilizationVisualization from './component/utilizationVisualization.vue';
import weekActivations from './component/weekActivations.vue';
import YieldVisualization from './component/YieldVisualization.vue';
import NVErrors from './component/NVErrors.vue';
import ComponentVisualization from './component/componentVisualization.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        weekActivations,
        YieldVisualization,
        input_outputVisualization,
        UtilizationVisualization,
        NVErrors,
        ComponentVisualization
    },
    methods: {

    },
    mounted() {
    }
}
</script>