<template>
    <q-dialog :model-value="event_dialog" persistent>
        <q-card style="width: 80vw; max-width: 80vw; max-height: 80vh; ">

            <q-card-section>
                <div class="row text-h6">
                    Información general <q-badge class="q-mx-md" :color="get_color(event_type)" :label="event_type" />
                </div>
                <div class="row q-col-gutter-x-sm">
                    <div class="col">
                        <q-select square v-model="employee_name" label="Empleado" :options="usuarios"
                            @filter="filterUser" use-input input-debounce="0" :readonly="disabled" />
                    </div>
                    <div class="col">
                        <q-select square v-model="event_type" :readonly="disabled" :options="types"
                            label="Tipo de evento" />
                    </div>
                    <div class="col">
                        <q-input v-model="start_date" :readonly="disabled" type="date" label="Fecha de inicio" />
                    </div>
                    <div class="col">
                        <q-input v-model="end_date" :readonly="disabled" type="date" label="Fecha de fin" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <q-input v-model="comments" :readonly="disabled" type="textarea" rows="1" label="Comentarios" />
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="vertical-bottom">
                <q-btn color="negative" label="Cancelar" @click="confirmCancel" :disable="disabled" />
                <q-btn color="positive" label="Modificar" @click="confirmUpdate" :disable="disabled" />
                <q-btn flat label="Cerrar" color="dark" @click="event_dialog = false" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { api } from 'boot/axios'
import { ClosePopup, useQuasar } from 'quasar';

export default {
    setup() {
    },
    data() {
        return {
            event_dialog: false,
            vacation_id: null,
            enable_finish: true,

            usuarios: [],
            users: [],
            types: [
                'Permiso sin goce',
                'Vacaciones',
                'Descanso',
                'Domingo laborado',
                'Falta'
            ],

            //Model variables
            event_type: null,
            end_date: null,
            employee_name: null,
            start_date: null,
            disabled: true,
            comments: null,
        }
    },
    emits: ['reload'],
    methods: {
        updateEvent() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_vacation', this.vacation_id)
            params.append('employee_id', this.employee_name.value)
            params.append('event_type', this.event_type)
            params.append('start_date', this.start_date)
            params.append('finish_date', this.end_date)
            params.append('comments', this.comments)
            //  TODO: GET ID FROM LOGGED USER
            // params.append('created_by', this.created_by)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/vacation_calendar', params, config).then((response) => {
                this.$q.notify({
                    message: response.data,
                    type: 'positive',
                    timeout: 2000,
                    position: 'top'
                })

                //Reload data and clean fields
                this.getData(this.vacation_id)
                this.$emit('reload')
                dismiss()

            }).catch((error) => {

                var error = error.response.data.error
                console.error(error);

                error.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        CancelEvent() {
            const dismiss = this.$q.notify({
                spinner: true,
                message: "Por favor, espera...",
                timeout: 0
            })

            const params = new URLSearchParams()
            params.append('id_vacation', this.vacation_id)
            params.append('employee_id', this.employee_name.value)

            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
                }
            }

            api.put('/vacation_calendar/cancel', params, config).then((response) => {
                this.$q.notify({
                    message: response.data,
                    type: 'positive',
                    timeout: 2000,
                    position: 'top'
                })

                //Reload data and clean fields
                this.getData(this.vacation_id)
                this.$emit('reload')
                dismiss()

            }).catch((error) => {

                var error = error.response.data.error
                console.error(error);

                error.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        confirmUpdate() {
            this.$q.notify({
                message: '¿Quieres modificar el evento?',
                color: 'positive',
                position: 'center',
                timeout: 0,
                actions: [
                    {
                        icon: 'check_circle', color: 'white', round: true, handler: () => {
                            this.updateEvent()
                        }
                    },
                    {
                        icon: 'cancel', color: 'white', round: true, handler: () => {
                            ClosePopup
                        }
                    }
                ]
            })
        },
        confirmCancel() {
            this.$q.notify({
                message: '¿Quieres cancelar el evento?',
                color: 'negative',
                position: 'center',
                timeout: 0,
                actions: [
                    {
                        icon: 'check_circle', color: 'white', round: true, handler: () => {
                            this.CancelEvent()
                        }
                    },
                    {
                        icon: 'cancel', color: 'white', round: true, handler: () => {
                            ClosePopup
                        }
                    }
                ]
            })
        },
        openDialog(id) {
            this.event_dialog = true;
            this.vacation_id = id
            this.loadData()
            this.getData(id)
        },
        getData(id) {
            api.get('/vacation_calendar/' + id).then((response) => {
                var data = response.data[0];
                this.event_type = data.EVENT_TYPE
                this.end_date = data.FINISH_DATE.substring(0, 10)
                this.start_date = data.START_DATE.substring(0, 10)
                this.comments = data.COMMENTS
                this.employee_name = this.users.find(
                    (i) => i.value == data.ID_EMPLOYEE
                )
                if (this.event_type == "Cancelado") {
                    this.disabled = true
                } else {
                    this.disabled = false
                }
            }).catch((error) => {
                console.error(error);
                var errors = error.response.data.error

                errors.forEach(err => {
                    this.$q.notify({
                        type: 'negative',
                        message: err.msg,
                        position: "top"
                    })
                });

                dismiss()
            })
        },
        loadData() {
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
        },
        get_color(type) {
            switch (type) {
                case 'Permiso sin goce':
                    return 'primary'
                case 'Vacaciones':
                    return 'positive'
                case 'Descanso':
                    return 'accent'
                case 'Domingo laborado':
                    return 'teal'
                case 'Falta':
                    return 'negative'
                case '4ta Falta':
                    return 'black'
                case 'Cancelado':
                    return 'blue-grey'
                default:
                    break;
            }
        }
    },
    props: ['calendar_id'],
    mounted() {
    }
}
</script>