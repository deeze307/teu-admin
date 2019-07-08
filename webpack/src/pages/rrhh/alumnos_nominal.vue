<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs9>
          <table-alumnos-nominal :query="filtro"/>
      </v-flex>
      <v-flex xs3>
          <v-text-field
                  v-model="filtro.documento_nro"
                  label="Documento del alumno"
                  dense
                  box
                  clearable
          ></v-text-field>

          <select-api-forms v-model="filtro.ciclo" :selected="filtro.ciclo" form="ciclos" label="Filtrar ciclo"/>
          <select-api-forms v-model="filtro.ciudad" form="ciudades" label="Filtrar localidad"/>
          <select-api-forms v-model="filtro.centro_id" form="centros" label="Filtrar centro" custom="id"/>
          <select-api-forms v-model="filtro.sector" form="sectores" label="Filtrar sector" text="sector"/>
          <select-api-forms v-model="filtro.nivel_servicio" form="niveles" label="Filtrar nivel de servicio" text="nivel_servicio"/>
          <select-api-forms v-model="filtro.anio" form="años" label="Filtrar año" text="anio"/>
          <select-api-forms v-model="filtro.division" form="divisiones" label="Filtrar division" text="division"/>
          <select-api-forms v-model="filtro.turno" form="turnos" label="Filtrar turno" text="turno"/>
          <select-api-forms v-model="filtro.estado_inscripcion" :selected="filtro.estado_inscripcion" form="estado_inscripcion" label="Filtrar estado" text="estado_inscripcion"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SelectApiForms from '../../components/apiforms/selectbox'
  import TableAlumnosNominal from '../../components/table_alumnos_nominal'


  export default {
    created: function(){
      store.commit('updateTitle',"SIEP | Inscripciones Nominales");
    },
    components :{
      SelectApiForms,
      TableAlumnosNominal
    },
    data () {
      return {
        filtro: {
          ciclo: 2018,
          estado_inscripcion: 'CONFIRMADA',
          division: 'con'
        }
      }
    },
    methods: {
    }
  }
</script>
