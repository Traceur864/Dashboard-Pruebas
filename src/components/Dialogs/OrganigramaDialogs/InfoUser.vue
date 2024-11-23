<template>
    <q-card style="width: 700px; max-width: 80vw;" >
        <q-card-section>
          <div class="text-h6">Información</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
            <div class="flex row q-pa-sm">
                <div class="col-4">
                    <q-avatar size="150px" font-size="52px">
                        <img src="/public/imgs/GitHub.jpg"/>
                    </q-avatar>
                </div>
                <div class="col-3 column">
                    <span class="text-subtitle1 q-mb-sm q-ml-md">
                        <q-icon 
                        name="las la-signature" 
                        color="black"
                        size="20px"
                        class="q-mr-sm"
                    />
                        Nombre:
                    </span>
                    <span class="text-subtitle1 q-mb-sm q-ml-md">
                    
                    <q-icon 
                    name="las la-at"
                    color="black"
                    size="20px"
                    class="q-mr-sm"
                    />
                
                    Correo:
                    </span>
                    <span class="text-subtitle1 q-mb-sm q-ml-md">
                        
                        <q-icon 
                        name="las la-mobile-alt"
                        color="black"
                        size="20px"
                        class="q-mr-sm"
                        />
                    
                        Teléfono:
                    </span>
                    <span class="text-subtitle1 q-mb-sm q-ml-md">
                    
                    <q-icon 
                      name="las la-id-card"
                      color="black"
                      size="20px"
                      class="q-mr-sm"
                    />
                  
                    No. Empleado:
                  </span>
              </div>
              <div class="col-5 column">
                <span class="text-subtitle1 q-mb-sm q-ml-lg">Edwin David Lopez Carpio</span>
                <span class="text-subtitle1 q-mb-sm q-ml-lg">Edwin@correo.com</span>
                <span class="text-subtitle1 q-mb-sm q-ml-lg">3329913903</span>
                <span class="text-subtitle1 q-mb-sm q-ml-lg">123090</span>
              </div>
          </div>
            
          <div class="flex row justify-between q-ma-lg">
              <div class="col-2">
                <span class="text-subtitle1">
                    
                    <q-icon 
                      name="las la-briefcase"
                      color="black"
                      size="20px"
                      class="q-mr-sm"
                    />
                  
                    Puesto:
                </span>
              </div>
              <div class="col-4">
                <span class="text-subtitle1 q-ml-md">Test Manager Engineer</span>
              </div>
              <div class="col-2">
                <span class="text-subtitle1">
                    
                    <q-icon 
                      name="las la-thumbtack"
                      color="black"
                      size="20px"
                      class="q-mr-sm"
                    />
                  
                    Area:
                </span>
              </div>
              <div class="col-4">
                <span class="text-subtitle1 q-ml-md">Programing</span>
              </div>
          </div>
          <div class="flex row justify-between q-ma-lg">
            <div class="col-2">
              <span class="text-subtitle1">
                    
                    <q-icon 
                      name="las la-user-clock"
                      color="black"
                      size="20px"
                      class="q-mr-sm"
                    />
                  
                    Turno:
                </span>
            </div>
            <div class="col-4">
              <span class="text-subtitle1 q-ml-md">Turno 1</span>
            </div>
            <div class="col-2">  
                <span class="text-subtitle1">
                    
                    <q-icon 
                      name="las la-birthday-cake"
                      color="black"
                      size="20px"
                      class="q-mr-sm"
                    />
                  
                    Birthday:
                </span>
            </div>
            <div class="col-4">
              <span class="text-subtitle1 q-ml-md">15/03/1995</span>
            </div>
            </div>
        
            <q-separator />

            <q-card-actions class="flex justify-end">
              <q-btn flat label="Cerrar" color="primary" v-close-popup />
            </q-card-actions>
          
        </q-card-section>
      </q-card>

</template>

<script setup>

defineOptions({
    name: 'InfoUser'
});
</script>