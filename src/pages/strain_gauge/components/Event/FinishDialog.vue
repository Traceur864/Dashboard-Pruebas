<template>
  <q-dialog v-model="finishDialog" persistent>
    <q-card style="width: 100vh">
      <q-card-section class="row items-center">
        <span class="text-h5">¿Finalizar Strain Gauge?</span>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col">
            <q-input v-model="sg_report" type="file" accept=".xls, .xlsx, .csv" hint="Archivo de calibración" filled
              square />
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="col">
            <q-input v-model="comments" square filled type="textarea" label="Comentarios"
              hint='En caso de no haber comentarios coloca "N/A"' maxlength="255" />
          </div>
        </div>
        <div class="row q-pt-md q-col-gutter-x-sm">
          <div class="col">
            <q-select square filled v-model="asigned_to" label="Responsable de SG" :options="usuarios"
              @filter="filterUser" use-input input-debounce="0" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Finalizar" color="positive" @click="finishStrainGauge" />
        <q-btn flat label="Cancelar" color="dark" @click="finishDialog = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios'

export default {
  props: ['event_id'],
  emits: ['reload'],
  data() {
    return {
      finishDialog: false,
      comments: '',
      usuarios: [],
      users: [],
      asigned_to: '',
      file: null,
      sg_report: null,

      //Login variables
      current_user: {},
    }
  },
  methods: {
    openDialog() {
      this.finishDialog = true;
      this.getData()
    },
    getData() {
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
    finishStrainGauge() {
      const dismiss = this.$q.notify({
        spinner: true,
        message: "Por favor, espera...",
        timeout: 0
      })

      const formData = new FormData()
      formData.append('event_id', this.props.event_id)
      formData.append('comments', this.comments)
      formData.append('asigned_to', this.asigned_to.value)
      formData.append('sg_report', this.sg_report[0])

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        }
      }

      api.put('/strain_gauge/finish', formData, config).then((response) => {
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
        this.setFinishSGEmail()
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
    },
    setFinishSGEmail() {


      api.get('/strain_gauge/' + this.props.event_id).then((response) => {
        var dataEmail = response.data[0];
        console.log(dataEmail);

        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idAssigned', dataEmail.ASIGNED_TO)
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('dateSended', dataEmail.FINISH_DATE)
        paramsEmail.append('sgNumber', dataEmail.ID_EVENT)


        api.post('email/finishSG', paramsEmail, configs).then(response => {

          console.log(response.data);

          this.$q.notify({
            color: 'positive',
            message: 'Correo enviado con éxito' || response.data,
            icon: 'check'
          })

          this.setNewEmailSG()
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
    setNewEmailSG() {
      api.get('/strain_gauge/lastevent').then((response) => {
        var dataEmailNew = response.data
        //console.log(dataEmailNew);
        //var START_DATE = '2025-01-30 09:45:00'
        const configs = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
          }
        }

        const paramsEmail = new URLSearchParams()
        paramsEmail.append('idAssignedNew', dataEmailNew.ASIGNED_TO)
        paramsEmail.append('idUser', this.current_user.id)
        paramsEmail.append('senderEmail', this.current_user.email)
        paramsEmail.append('dateSendNew', dataEmailNew.START_DATE)
        //paramsEmail.append('dateSendNew', START_DATE)
        paramsEmail.append('sgNumberNew', dataEmailNew.ID_EVENT)


        api.post('email/startNewSG', paramsEmail, configs).then(response => {

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
