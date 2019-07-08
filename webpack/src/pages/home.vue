<template v-bind:style="{ backgroundColor: color}">
    <v-container fluid>
      <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <img src="@/assets/FOTO DE PERFIL.jpg" alt="TEU" style="width:300px;">

            <v-divider></v-divider>
            <v-flex pt-2 pb-2>
              <v-card raised>
                <v-card-title>
                  <div>
                    <h4>Mediante este sitio podrás:</h4>
                  </div>
                  <div class="caption">
                    - Ver/Agregar/Editar los empleos que TeU ha recibido.<br>
                    - Ver/Agregar/Editas las categorías de los empleos.<br>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>

          </v-layout>
      </v-slide-y-transition>
    </v-container>
</template>
<script>

  import FacebookIcon from "vue-material-design-icons/facebook.vue"
  import GoogleIcon from "vue-material-design-icons/google.vue"


  import router from '../router'

  export default {
    data(){
      return{
        isMobile:false,
        items: [],
        color: '#5C6BC0',
        apigw: process.env.SIEP_API_GW_INGRESS,
      }
    },
    created: function(){
      store.commit('updateTitle',"Trabaja en Ushuaia");
    },
    components :{ FacebookIcon,GoogleIcon  },
    name: "home",
    computed:{
      user(){
        return store.state.user
      },
      dialog(){
        console.log("Dialog",store.state.dialog.dialog);
        return store.state.dialog.dialog;
      }
    },
    mounted(){
      this.onResize();
    },
    watch:{
      dialog(){}
    },
    methods:{
      onResize(){
        if(window.innerWidth <= 480){
          this.isMobile = true;
        }else{
          this.isMobile = false;
        }
      },
      goTo : function(social){
        window.location = this.apigw+'/auth/social/'+social+'?app=siep-pwa';
      },
      logout : function(){
        if(this.user.loggedIn){
          store.dispatch('logout');
        }
      }
    }
  }
</script>

<style>
    body {
        background-color: #5C6BC0;
    }

    FacebookIcon {
        font-size: 50px;
    }

    .carousel {
      height: 250px;
    }

    .carousel-mobile {
      height: 180px;
    }

    .v-jumbotron__image { 
      height: 100% !important;
      min-width: 50% !important;
      max-width: 100% !important; 
    }

</style>