<template>
  <v-toolbar flat class="transparent" v-if="persona">
    <v-list class="pa-0">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img src="@/assets/nophoto.png" >
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{persona.nombres}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-toolbar>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    computed: {
      user() {
        return store.state.user;
      },
      persona(){
        return store.getters.persona;
      },
    }
  }
</script>