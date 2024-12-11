<template>
    <q-dialog v-model="finishDialog" persistent>
        <q-card style="width: 100vh">
            <q-card-section class="row items-center">
                <span class="text-h5">¿Finalizar Mantenimiento?</span>
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <div class="col">
                        <q-input v-model="comments" square filled type="textarea" label="Comentarios"
                            hint='En caso de no haber comentarios coloca "N/A"' maxlength="255" />
                    </div>
                </div>
                <!--<div class="row q-pt-md q-col-gutter-x-sm">
                    <div class="col">
                        <q-select square filled v-model="asigned_to" label="Responsable de SG" :options="usuarios"
                            @filter="filterUser" use-input input-debounce="0" />
                    </div>
                    <div class="col">
                        <q-select v-model="shift" :options="['Turno 1', 'Turno 2', 'Turno 3']" label="Turno" square
                            filled />
                    </div>
                </div>-->
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Finalizar" color="positive" @click="onSubmit" />
                <q-btn flat label="Cancelar" color="dark" @click="finishDialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
    setup(props) {
        return {
            props
        }
    },
    props: ['id_maintenance'],
    emits: ['reload'],
    data() {
        return {
            finishDialog: false,
            comments: '',
            event_type: '',
            // usuarios: [],
            // users: [],
            // asigned_to: '',
            // shift: '',
        }
    },
    methods: {
        openDialog(data) {
            this.event_type = data
            this.finishDialog = true;
            // this.getData()
        },
        /*getData() {
            api.get('/users/testusers').then((response) => {
                var data = response.data
                this.usuarios = []
                data.forEach(dat => {
                    this.usuarios.push({
                        value: dat.ID_USER,
                        label: dat.NAME + " " + dat.LASTNAME
                    })
                });
                this.users = this.usuarios
            }).catch((err) => {
                console.error(err);
            })
        },
        filterUser(val, update, abort) {
            if (val === '') {
                update(() => {
                    this.usuarios = this.users
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                this.usuarios = this.usuarios.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
            })
        },*/
        onSubmit() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_maintenance', this.id_maintenance)
            params.append('comments', this.comments)
            params.append('made_by', 1)

            // TODO: GET ISER ID FROM LOCAL STORAGE
            // params.append('made_by', this.current_user.id)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            var route = ''

            if (this.event_type == 'Calibración') {
                route = '/calibration/finish'
            } else if (this.event_type == 'Mantenimiento') {
                route = '/maintenance/finish'
            }

            api.put(route, params, config).then((response) => {
                dismiss()
                response.data.data.forEach(data => {
                    this.$q.notify({
                        type: 'positive',
                        message: data,
                        position: "top",
                        timeout: 5000
                    })
                });

                this.$emit('reload')
                this.finishDialog = false

            }).catch((error) => {

                dismiss()
                try {
                    var errors = error.response.data.error
                } catch (err) {
                    console.error(err);
                    console.error(error);
                }
                console.error(errors);
                errors.forEach(ele => {
                    this.$q.notify({
                        type: 'negative',
                        message: ele.msg,
                        position: "top"
                    })
                });

            })
        }
    },
    mounted() {

    }
}
</script>