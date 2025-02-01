<template>
    <q-page>
        <div class="column">
            <div class="col-auto self-center">
                <h4 class="text-bold">Selecciona un modelo</h4>
            </div>
        </div>
        <div class="row justify-center q-gutter-xl q-px-lg ">
            <div class="col-auto">
                <q-btn color="purple" size="xl" class="bg" label="PG520" @click="onClick" />
            </div>
            <div class="col-auto">
                <q-btn color="purple" size="xl" class="bg" label="P2312" @click="onClick" />
            </div>
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