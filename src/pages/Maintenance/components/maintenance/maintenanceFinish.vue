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
      current_user: {},
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
      params.append('made_by', this.current_user.id)

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
        console.log(route);

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

        if (route == '/calibration/finish') {
          this.getCalibrationFinish()
        } else if (route == '/maintenance/finish') {
          this.getMaintenanceFinish()
        }

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
    },
    getCalibrationFinish() {
      api.get('/calibration/' + this.id_maintenance).then((response) => {
        var dataCalibrationEmail = response.data[0];
        console.log(dataCalibrationEmail);

        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('typeEvent', dataCalibrationEmail.EVENT_TYPE)
        paramsEmail.append('finishDate', dataCalibrationEmail.FINISH_DATE)
        paramsEmail.append('mNumber', dataCalibrationEmail.ID_MAINTENANCE)

        if (dataCalibrationEmail.ID_ATM != null && dataCalibrationEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataCalibrationEmail.ATM_SN)

        } else if (dataCalibrationEmail.ID_ATM == null && dataCalibrationEmail.ID_TESTER != null) {
          paramsEmail.append('machine', dataCalibrationEmail.TESTER_SN)

        }

        api.post('/emailMC/finishCalibration', paramsEmail, configs).then(response => {

          console.log(response.data);

          this.$q.notify({
            color: 'positive',
            message: 'Correo enviado con éxito' || response.data,
            icon: 'check',
            position: 'top'
          })

          this.getLastCalibrationEmail()

        }).catch(error => {

          if (error.response && error.response.data) {
            // Mostrar el mensaje de error del servidor
            this.$q.notify({
              color: 'negative',
              message: error.response.data.msg || 'Error desconocido',
              icon: 'warning',
            });
          } else {
            // En caso de que no haya respuesta, mostrar un mensaje genérico
            this.$q.notify({
              color: 'negative',
              message: 'Hubo un error al enviar el correo',
              icon: 'error',
            });
            console.error('Error al enviar correo:', error);

          }
        });
      }).catch((error) => {
        console.error(error);
      })
    },

    getMaintenanceFinish() {
      api.get('/maintenance/' + this.id_maintenance).then((response) => {
        var dataMaintenanceEmail = response.data[0];
        console.log(dataMaintenanceEmail);

        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('typeEvent', dataMaintenanceEmail.EVENT_TYPE)
        paramsEmail.append('finishDate', dataMaintenanceEmail.FINISH_DATE)
        paramsEmail.append('mNumber', dataMaintenanceEmail.ID_MAINTENANCE)

        if (dataMaintenanceEmail.ID_ATM != null && dataMaintenanceEmail.ID_FIXTURE == null && dataMaintenanceEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataMaintenanceEmail.ATM_SN)

        } else if (dataMaintenanceEmail.ID_ATM == null && dataMaintenanceEmail.ID_FIXTURE != null && dataMaintenanceEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataMaintenanceEmail.FIXTURE_ID)

        } else if (dataMaintenanceEmail.ID_ATM == null && dataMaintenanceEmail.ID_FIXTURE == null && dataMaintenanceEmail.ID_TESTER != null) {
          paramsEmail.append('machine', dataMaintenanceEmail.TESTER_SN)

        }

        api.post('/emailMC/finishMaintenance', paramsEmail, configs).then(response => {

          console.log(response.data);

          this.$q.notify({
            color: 'positive',
            message: 'Correo enviado con éxito' || response.data,
            icon: 'check',
            position: 'top'
          })

          this.getLastMaintenanceEmail()

        }).catch(error => {

          if (error.response && error.response.data) {
            // Mostrar el mensaje de error del servidor
            this.$q.notify({
              color: 'negative',
              message: error.response.data.msg || 'Error desconocido',
              icon: 'warning',
            });
          } else {
            // En caso de que no haya respuesta, mostrar un mensaje genérico
            this.$q.notify({
              color: 'negative',
              message: 'Hubo un error al enviar el correo',
              icon: 'error',
            });
            console.error('Error al enviar correo:', error);

          }
        });

      }).catch((error) => {
        console.error(error);
      })
    },
    getLastCalibrationEmail() {
      api.get('/maintenance/lastcalibration').then((response) => {
        var dataCalibrationEmail = response.data
        console.log(dataCalibrationEmail);

        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('typeEvent', dataCalibrationEmail.EVENT_TYPE)
        paramsEmail.append('newDate', dataCalibrationEmail.PLAN_DATE)
        paramsEmail.append('mNumber', dataCalibrationEmail.ID_MAINTENANCE)

        if (dataCalibrationEmail.ID_ATM != null && dataCalibrationEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataCalibrationEmail.ID_ATM)
          paramsEmail.append('machineCheck', 'ATM')

        } else if (dataCalibrationEmail.ID_ATM == null && dataCalibrationEmail.ID_TESTER != null) {
          paramsEmail.append('machine', dataCalibrationEmail.ID_TESTER)
          paramsEmail.append('machineCheck', 'Tester')

        }

        api.post('emailMC/startNewCalibration', paramsEmail, configs).then(response => {

          console.log(response.data);

          this.$q.notify({
            color: 'positive',
            message: 'Correo enviado con éxito' || response.data,
            icon: 'check'
          })

        }).catch(error => {

          if (error.response && error.response.data) {
            // Mostrar el mensaje de error del servidor
            this.$q.notify({
              color: 'negative',
              message: error.response.data.msg || 'Error desconocido',
              icon: 'warning',
            });
          } else {
            // En caso de que no haya respuesta, mostrar un mensaje genérico
            this.$q.notify({
              color: 'negative',
              message: 'Hubo un error al enviar el correo',
              icon: 'error',
            });
            console.error('Error al enviar correo:', error);

          }
        });
      }).catch((error) => {
        console.error(error);
      })
    },
    getLastMaintenanceEmail() {
      api.get('/maintenance/lastmaintenance').then((response) => {
        var dataMaintenanceEmail = response.data
        console.log(dataMaintenanceEmail);

        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }
        //var dateNow = "2025-02-05 12:59:00";

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('typeEvent', dataMaintenanceEmail.EVENT_TYPE)
        paramsEmail.append('newDate', dataMaintenanceEmail.PLAN_DATE)
        //paramsEmail.append('newDate', dateNow)
        paramsEmail.append('mNumber', dataMaintenanceEmail.ID_MAINTENANCE)

        if (dataMaintenanceEmail.ID_ATM != null && dataMaintenanceEmail.ID_FIXTURE == null && dataMaintenanceEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataMaintenanceEmail.ID_ATM)
          paramsEmail.append('machineCheck', 'ATM')

        } else if (dataMaintenanceEmail.ID_ATM == null && dataMaintenanceEmail.ID_FIXTURE != null && dataMaintenanceEmail.ID_TESTER == null) {
          paramsEmail.append('machine', dataMaintenanceEmail.ID_FIXTURE)
          paramsEmail.append('machineCheck', 'Fixture')

        } else if (dataMaintenanceEmail.ID_ATM == null && dataMaintenanceEmail.ID_FIXTURE == null && dataMaintenanceEmail.ID_TESTER != null) {
          paramsEmail.append('machine', dataMaintenanceEmail.ID_TESTER)
          paramsEmail.append('machineCheck', 'Tester')

        }

        api.post('emailMC/startNewMaintenance', paramsEmail, configs).then(response => {

          console.log(response.data);

          this.$q.notify({
            color: 'positive',
            message: 'Correo enviado con éxito' || response.data,
            icon: 'check'
          })

        }).catch(error => {

          if (error.response && error.response.data) {
            // Mostrar el mensaje de error del servidor
            this.$q.notify({
              color: 'negative',
              message: error.response.data.msg || 'Error desconocido',
              icon: 'warning',
            });
          } else {
            // En caso de que no haya respuesta, mostrar un mensaje genérico
            this.$q.notify({
              color: 'negative',
              message: 'Hubo un error al enviar el correo',
              icon: 'error',
            });
            console.error('Error al enviar correo:', error);

          }
        });

      }).catch((error) => {
        console.error(error);
      })
    }
  },
  mounted() {
    this.current_user = JSON.parse(localStorage.getItem("userLogin"))
  }
}
</script>
