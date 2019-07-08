<template>
  <v-app dark>

    <!-- Menu toolbar !-->
    <v-toolbar app color="orange darken-3" dark >
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title v-text="menu_toolbar.title" ></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn flat @click="goTo('/empleos')" ><v-icon>work</v-icon></v-btn>
        <v-btn flat><v-icon>settings</v-icon></v-btn>
        <v-btn flat @click="goTo('/')"><v-icon>home</v-icon></v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <!-- Contenido de navegacion !-->
    <v-content>

      <!-- Alert Message -->
      <v-alert
        :value="alert.show"
        :type="alert.class" 
        transition="scale-transition"
      >
        {{ alert.message }}
      </v-alert>
      <!-- /Alert Message -->
      <transition-page>
        <router-view/>
      </transition-page>
    </v-content>

    <!-- Footer -->
    <v-footer
      height="auto"
      color="blue-grey darken-2"
    >
      <v-flex
        text-xs-center
        white--text
        xs12
      >
        &copy; 2019 — <strong>Trabaja en Ushuaia (TeU) - Desarrollado por Diego Maidana.</strong>
      </v-flex>
    </v-footer>

  </v-app>
</template>

<script>
  import UserSidebar from './components/user_sidebar.vue'
  import MenuSidebar from './components/menu_sidebar.vue'
  import TransitionPage from './components/TransitionPage.vue'

  import router from './router'

  export default {
    components: { UserSidebar, MenuSidebar, TransitionPage },
    data () {
      return {
        drawer: false,
        toolbar_disabled:true
      }
    },
    computed: {
      menu_toolbar() {
        return store.state.menu_toolbar;
      },
      alert() {
        console.log(store.state.alert.alert);
        return store.state.alert.alert;
      }
      
    },
    watch:{
      alert(newValue,oldValue) {
        setTimeout(() => newValue.show = false, 3000);
      },
    },
    created(){
      console.log('APP Created');
      store.dispatch('extractToken');
    },
    methods:{
      goTo(route){
        router.push({
          path: route
        });
      }
    },
    name: 'App'
  }
</script>
<style>
  
</style>

