<template>
    <div class="row q-col-gutter-md q-pt-md">
        <div class="col-auto">
            <q-badge color="orange" text-color="black" class="text-h6">Fixtura: {{ data[0] }} </q-badge>
        </div>
    </div>

    <div class="row">
        <div v-for="info in data[1]" v-bind:key="info.FIXTURE" class="col-4">
            <YieldDay :data="info" />
        </div>
    </div>

</template>

<script>
import YieldDay from './yieldDay.vue';

export default {
    data() {
        return {
            helper: ''
        }
    },
    components: {
        YieldDay
    },
    props: ['data'],
    methods: {
    },
}
</script>