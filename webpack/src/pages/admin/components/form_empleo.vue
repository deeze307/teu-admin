<template>
  <v-flex>
    <!-- Vinculo -->
    <v-combobox
            id="vinculo"
            v-if="familiar"
            v-model="form.vinculo"
            :items="items_vinculo"
            :rules="inputRules"
            label="Vinculo con el Estudiante"
            hint="Campo Requerido"
            required
    ></v-combobox>

    <!-- Nombres -->
    <v-text-field
            v-model="form.nombres"
            :rules="inputRules"
            label="Nombres"
            hint="Campo Requerido"
            required
    ></v-text-field>

    <!-- Apellidos -->
    <v-text-field
            v-model="form.apellidos"
            :rules="inputRules"
            label="Apellidos"
            hint="Campo Requerido"
            required
    ></v-text-field>

    <!-- Fecha de nacimiento -->
    <v-menu
        :close-on-content-click="false"
        v-model="menu_date_picker"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px">
        <v-text-field
            slot="activator"
            v-model="computedDateFormatted"
            label="Fecha de Nacimiento"
            hint="DD/MM/AAAA"
            persistent-hint
            prepend-icon="event"
            readonly
        ></v-text-field>
        <v-date-picker
            ref="picker"
            v-model="form.fecha_nac"
            locale="es-ar"
            no-title
            @input="menu_date_picker = false"
            :max="new Date().toISOString().substr(0, 10)"
            min="1940-01-01"
        ></v-date-picker>
    </v-menu>

    <!-- Sexo -->
    <v-combobox
          v-model="form.sexo"
          :items="items_sexo"
          :rules="inputRules"
          label="Sexo"
          hint="Campo Requerido"
          required
    ></v-combobox>

    <!-- Tipo de documento -->
    <v-combobox
            v-model="form.documento_tipo"
            :items="items_tipo_doc"
            :rules="inputRules"
            label="Tipo de Documento"
            hint="Campo Requerido"
            required
    ></v-combobox>

    <!-- Numero de documento -->
    <v-text-field
            v-model="form.documento_nro"
            :rules="inputRules"
            label="Número de Documento"
            @blur="findDNI()"
            hint="Campo Requerido | Sin Puntos de separación"
            type="number"
            min="0"
            max="999999999"
            :disabled="disabledOnUpdate"
            required
    ></v-text-field>

    <!-- Email -->
    <v-text-field
            v-if="familiar"
            v-model="form.email"
            :rules="emailRules"
            label="E-Mail"
            hint="Campo Requerido"
            required
    ></v-text-field>

    <!-- Telefono nro -->
    <v-text-field
            v-model="form.telefono_nro"
            :rules="inputRules"
            label="Teléfono"
            hint="Campo Requerido"
            required
    ></v-text-field>

    <!-- Ciudad -->
    <v-combobox
            v-model="form.ciudad"
            :items="items_localidad"
            :rules="inputRules"
            label="Ciudad donde vive"
            hint="Campo Requerido"
            required
    ></v-combobox>

    <!-- Barrio -->
    <v-combobox
            v-model="form.barrio"
            :items="barriosApi"
            :rules="inputRules"
            label="Barrio donde vive"
            hint="Campo Requerido"
            :loading="user.apiNeighborhoodFiltering"
            :disabled="user.apiNeighborhoodFiltering"
            required
    ></v-combobox>

      <v-subheader>Su domicilio actual es</v-subheader>
    <!-- Calle nombre -->
    <v-text-field
            v-model="form.calle_nombre"
            :rules="inputRules"
            label="Calle nombre"
            hint="Campo Requerido"
            light
            required
    ></v-text-field>

    <!-- Calle numero -->
    <v-text-field
            v-model="form.calle_nro"
            label="Calle número"
    ></v-text-field>

    <!-- Depto casa -->
    <v-text-field
            v-model="form.depto_casa"
            label="Depto / Casa (letra o número)"
          
    ></v-text-field>

    <!-- Tira edificio -->
    <v-text-field
            v-model="form.tira_edificio"
            label="Tira / Edificio (letra o número)"
          
    ></v-text-field>

    <!-- Comentario: por el momento está deshabilitado -->
    <!-- <v-textarea
            v-model="form.observaciones"
            :label="texto_observacion"
            hint="Puede redactar otra observación de interés"
            color="primary"
            counter="100"
            v-bind:placeholder="observacion_placeholder"
    ></v-textarea> -->

    <v-btn color="primary" @click="goBack"><v-icon>navigate_before</v-icon> Volver</v-btn>
    <v-btn v-if="mode=='create'" color="light-green lighten-1" @click="createPersona">Guardar</v-btn>
    <v-btn v-if="mode=='update'" color="light-orange lighten-1" @click="updatePersona">Actualizar</v-btn>
  </v-flex>
</template>

<script>
  import router from '../../../router'

  export default {
    props: ['familiar','alumno','mode','title'],
    data: ()=>({
      disabledOnUpdate:false,
      inputRules: [
        v => !!v || 'Campo Requerido',
        v => (!v || v.length >= 3) || 'El campo debe tener más de 3 caracteres'
      ],
      inputRulesAlmostOne: [
        v => !!v || 'Campo Requerido',
        v => (!v || v.length >= 1) || 'El campo debe tener más de 1 caracter'
      ],
      emailRules: [
        v => !!v || 'Campo Requerido',
              v => /.+@.+/.test(v) || 'El E-Mail debe ser valido'
      ],
      menu_date_picker:null,
      items_vinculo:["Madre","Padre","Tutor"],
      items_tipo_doc:["DNI","CI","LC","LE","Cédula Mercosur","Pasaporte extranjero","Cédula de identidad extranjera","Otro documento extranjero","No posee","En trámite"],
      items_sexo:["Masculino","Femenino"],
      items_localidad:["Rio Grande","Ushuaia","Tolhuin"],
      observacion_placeholder:"",
      texto_observacion: "Observación",
      combo_barrios_searching:false,
      combo_barrios_api:[],

      form:{},
      alerta:{},

      date: null,
      menu: false
    }),
    computed:{
      user(){
        return store.state.user;
      },
      computedDateFormatted () {
        return this.formatDate(this.form.fecha_nac)
      },
      getFamiliar() {
        return this.familiar
      },
      barriosApi(){
        // console.log("Aqui los barrios: ",store.getters.barriosApi);
        return store.getters.barriosApi;
      }
    },
    created: function(){
      store.commit('updateTitle',this.title);

      this.observacionPlaceHolder();

      // Se debe setear el tipo de persona a dar de alta
      if(this.getFamiliar)
      {
        // MODO CREATE
        if(this.mode == 'create'){
          this.disabledOnUpdate = false;
          this.form.email = store.state.user.authApi.email;
        }

        // MODO UPDATE
        if(this.mode == 'update'){
          this.disabledOnUpdate = true;
          if(store.getters.persona) {
            this.form = store.getters.persona;
            this.form.ciudad = this.form.ciudad.nombre;
          }
        }

        this.form.familiar = 1;
        this.form.alumno = 0;

      }

      if(this.alumno)
      {
        this.form.email = store.state.user.authApi.email;
        this.form.alumno = 1;
        this.form.familiar = 0;
        this.texto_observacion = 'Indique instituciones de preferencia';
      }

      // Permite la edicion de los datos del familiar
    },
    watch: {
      menu_date_picker (val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      'form.documento_nro'(){
        if(this.disabledOnUpdate){
          console.log("Está editando su perfíl");
        }else{

        }
      },
      'form.ciudad'(){
        this.fillNeighborhood();
      },
      barriosApi(){}
    },
    methods:{
      createPersona:function(){
        if(_.isEmpty(this.form.vinculo) && this.getFamiliar){
          var options = {
              container: '#vinculo',
              easing: 'ease-in',
              offset: -60,
              force: true,
              cancelable: true,
              onStart: function(element) {
                // scrolling started
              },
              onDone: function(element) {
                // scrolling is done
              },
              onCancel: function() {
                // scrolling has been interrupted
              },
              x: false,
              y: true
          }

          cancelScroll = this.$scrollTo(element, duration, options)
          this.alerta = {
            class: "error",
            message: "Debe completar el campo de Vinculo con el Estudiante",
            show: true
          };
          store.dispatch('toggleAlertMessage',this.alerta);
        }else{
          this.form.pcia_nac ="esta";
          this.form.nacionalidad ="esta";
          this.form = _.omitBy(this.form, _.isEmpty);
          this.form._method = "POST";
          this.form.familiar = this.getFamiliar ? 1 : 0;
          this.form.alumno = !this.getFamiliar ? 1 : 0;
          store.dispatch('apiCreatePersona',this.form);
        }
        
      },
      updatePersona:function(){
        if(_.isEmpty(this.form.vinculo) && this.getFamiliar){

          var options = {
              el: '#vinculo',
              easing: 'ease-in-out',
              offset: -60,
              force: true,
              cancelable: true,
              onStart: function(element) {
                // scrolling started
              },
              onDone: function(element) {
                // scrolling is done
              },
              onCancel: function() {
                // scrolling has been interrupted
              },
              x: false,
              y: true
          }

          var cancelScroll = this.$scrollTo(300, options)

          this.alerta = {
            show: true,
            class: "error",
            message: "Debe completar el campo de Vinculo"
          };
          store.dispatch('toggleAlertMessage',this.alerta);
        }else{
          this.form.pcia_nac ="esta";
          this.form.nacionalidad ="esta";
          this.form = _.omitBy(this.form, _.isEmpty);
          this.form.familiar = this.getFamiliar ? 1 : 0;
          this.form.alumno = !this.getFamiliar ? 1 : 0,
          this.form._method = "PUT";
          store.dispatch('apiUpdatePersona',this.form);
        }
        
      },
      findDNI:function(){
        if(this.form.documento_nro.length > 6){
          store.dispatch('apiFindDni',this.form.documento_nro);
        }

      },
      goBack:function(){
        router.go(-1);
      },
      formatDate (date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null;

        const [day, month, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },
      observacionPlaceHolder(){
        if(this.familiar){
          this.observacion_placeholder = "Si su hijo/a ya pertenece al sistema educativo pcial indique institución de preferencia";
        }else{
          this.observacion_placeholder = "";
        }
      },
      save(computedDateFormatted) {
        this.$refs.menu.save(computedDateFormatted)
      },
      fillNeighborhood() {
        if(this.form.barrio  && this.form.barrio.length > 0){
          this.form.barrio = "";
        }
        store.dispatch('apiFilterNeighborhood',{ciudad:this.form.ciudad});
      },
    }
  }
</script>