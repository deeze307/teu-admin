<template>
  <v-layout row justify-center>

    <v-dialog
      v-model="dialogProps.show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline text-center">{{dialogProps.title}}</v-card-title>

        <v-card-text>
          {{dialogProps.message}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            v-if="dialogProps.show"
            color="green darken-1"
            flat="flat"
            @click="dialogProps.show = false"
          >
            Entiendo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name:'VuetifyDialog',
    props:['dialogProps'],
    data () {
      return {
      }
    },
    created(){
      console.log("Creando Dialog");
    }
  }
</script>