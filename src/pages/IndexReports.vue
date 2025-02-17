<template>
    <q-page>
        <div class="column">
            <div class="col-auto self-center">
                <h4 class="text-bold">Reportes por modelos</h4>
            </div>
        </div>
        <div class="row justify-center q-gutter-xl q-px-lg ">
            <q-btn color="purple" size="xl" class="col-4" label="PG520" @click="$router.push('/other_models/2G520')" />
            <q-btn color="purple" size="xl" class="col-4" label="P2312" @click="$router.push('/other_models/2312')" />
            <q-btn color="primary" size="xl" class="col-4" label="ICT" @click="$router.push('/ICT')" />
            <q-btn color="primary" size="xl" class="col-4" label="MDA" @click="$router.push('/MDA')" />
        </div>
    </q-page>
</template>
<script>
export default {
    methods: {

    },
    mounted() {
    }
}
</script>