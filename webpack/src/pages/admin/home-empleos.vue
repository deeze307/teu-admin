<template>
  <v-container>
      <v-flex xs12 class="text-xs-center">
         <v-progress-circular
              :size="70"
              :width="7"
              color="orange"
              indeterminate
              v-if="user.apiGetUserDataRunning"
      ></v-progress-circular>

      <!-- Resultados de busqueda -->
      <v-container fluid grid-list-lg>
        <v-layout >
          <tabla-empleos />
        </v-layout>
      </v-container>

        <v-container>
          <v-divider />

          <br>
          
        </v-container>


      </v-flex>
    </v-container>
</template>

<script>
  import router from '../../router'
  import axios from 'axios'

  import TablaEmpleos from './tabla-empleos'

  export default {
    components:{TablaEmpleos},
    data: ()=>({
      apigw: process.env.TEU_API,
      documento_nro:"",
      findPersonaRunning: false,
      resultado:[],
      form:{},
    }),
    created: function(){
      store.commit('updateTitle',"Empleos");
    },
    mounted:function(){
    },
    computed:{
      user(){
        return store.state.user
      }
    },
    watch:{
      alumnos(){
      }
    },
    methods:{
      startFindPersona:function(){
        let vm = this;
        vm.findPersonaRunning = true;
        vm.resultado = [];
        
        store.dispatch('apiFindPersona',{
          documento_nro:this.documento_nro,
          alumno:1
        })
          .then(function (response) {
            // handle success
            vm.resultado = response.data.data;
            vm.findPersonaRunning = false;
        })
          .catch(function (error) {
            // handle error
            vm.resultado = [];
            vm.findPersonaRunning = false;
          });
      },
      goNewStudent:function(){
        router.push('/inscripciones/alumno');
      },
      goBack:function(){
        router.go(-1);
      },
      goWithSelected:function(alumno){
        store.dispatch('relateAlumnoFamiliars',alumno);
      }
    }
  }
</script>

<style scoped>
</style>
