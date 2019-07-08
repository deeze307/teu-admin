<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs9>
        <table-matriculas-cuantitativa-por-seccion :query="filtro"/>
      </v-flex>
      <v-flex xs3>
        <select-api-forms v-model="filtro.ciclo" selected="2018" form="ciclos" label="Filtrar ciclo"/>
        <select-api-forms v-model="filtro.ciudad" form="ciudades" label="Filtrar localidad"/>
        <select-api-forms v-model="filtro.centro_id" form="centros" label="Filtrar centro" custom="id"/>
        <select-api-forms v-model="filtro.nivel_servicio" form="niveles" label="Filtrar nivel de servicio" text="nivel_servicio"/>
        <select-api-forms v-model="filtro.anio" form="años" label="Filtrar año" text="anio"/>
        <select-api-forms v-model="filtro.division" form="divisiones" label="Filtrar division" text="division"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SelectApiForms from '../../components/apiforms/selectbox'
  import TableMatriculasCuantitativaPorSeccion from '../../components/table_matriculas_cuantitativa_por_seccion'

  export default {
    created: function(){
      store.commit('updateTitle',"SIEP | Secciones");
    },
    components :{
      SelectApiForms,
      TableMatriculasCuantitativaPorSeccion,
    },
    data () {
      return {
        filtro: {
          ciclo: 2018,
          division: 'con'
        },
      }
    },
    methods: {
    }
  }
</script>
