// Modelo Alumno

const module = {
  state: {
    vinculo:"",
    nombres: "",
    apellidos: "",
    fecha_nac:"",
    sexo:"",
    tipo_doc:"",
    nro_doc:"",
    nacionalidad:"",
    provincia:"",
    localidad:"",
    direccion:"",
    comentarios:""
  },
  mutations: {
    update_nombres(state,valor) {
      state.nombres = valor
    },
    update_apellidos(state,valor){
      state.apellidos = valor
    },
    update_fecha_nac(state,valor){
      state.fecha_nac = valor
    },
    update_sexo(state,valor){
      state.sexo = valor
    },
    update_tipo_doc(state,valor){
      state.tipo_doc = valor
    },
    update_nro_doc(state,valor){
      state.nro_doc = valor
    },
    update_nacionalidad(state,valor){
      state.nacionalidad = valor
    },
    update_provincia(state,valor){
      state.provincia = valor
    },
    update_localidad(state,valor){
      state.localidad = valor
    },
    update_direccion(state,valor){
      state.direccion = valor
    },
    update_comentarios(state,valor){
      state.comentarios = valor
    },
    update_vinculo(state,vinculo){
      state.vinculo = vinculo
    }
  }
};

export default module