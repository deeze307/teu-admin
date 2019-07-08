// Modelo User
import axios from 'axios'
import router from '../../router'

const module = {
  state: {
    authToken: null,
    authApi: {},
    apiGetUserDataRunning: false,
    apiNeighborhoodFiltering:false,
    neighborhoodApi:[],
    porcentaje_perfil: 0,
    isEdition: false,
    loggedIn: false,
    alumnos: {},
    familiar: {}
  },
  getters: {
    persona: state => {
      return state.authApi.persona;
    },
    alumnos: state => state.alumnos,
    barriosApi: state => state.neighborhoodApi
    
  },
  mutations: {
    update_nombre_completo(state,payload) {
      state.nombre_completo = payload
    },
    addWebToken: function(state, webToken){
      state.authToken = webToken;
    },
    updateAuthApi: function(state, apiResponse){
      state.authApi = apiResponse;
    },
    logout: function(state){
      state.loggedIn = false;
      state.authToken = null;
      state.authApi = {};
    },
    retrieveAlumnos(state,payload){
      state.alumnos = payload;
    },
    refillNeighborhood(state,payload){
      state.neighborhoodApi = payload;
    }
  },
  actions: {
    // Extrae el token de la URL e inicia el login
    extractToken:function(context){
      var parsedUrl = new URL(window.location.href);
      var token = parsedUrl.searchParams.get("token");
      if(token !== null){
        context.dispatch('login', {token : token});
      }else{
        context.dispatch('tokenMissing');
      }
    },
    // Guarda el token en el modelo
    login: function(context, data){
      context.commit('addWebToken', data.token);
      context.dispatch('apiGetUserData');
    },
    // Usuario autenticado con exito, retorna datos de usuario desde api
    loginSuccess: function({state}){
      console.log('user.loginSuccess()',state);
      state.loggedIn = true;
      router.push({
        path: '/home'
      });
    },
    // No existe token
    tokenMissing: function({state}){
      console.log('User not logged in, token missing');
      state.loggedIn = false;
      router.push({
        path: '/'
      });
    },
    // Se desloguea y redirecciona a /login
    logout: function(context){
      context.commit('logout');
    },
    apiGetUserData: function({commit,dispatch,state}) {
      if(!this.apiGetUserDataRunning) {
        state.apiGetUserDataRunning = true;

        const curl = axios.create({
          baseURL: process.env.SIEP_API_GW_INGRESS
        });
        // En todas las request envia el token por header
        curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

        curl.get('/auth/social/me')
            .then(function (response) {
              // handle success
              commit('updateAuthApi',response.data);
              dispatch('loginSuccess');

              state.apiGetUserDataRunning = false;
            })
            .catch(function (error) {
              // handle error
              console.log(error);
              dispatch('tokenMissing');

              state.apiGetUserDataRunning = false;
            });

      }

      /*return new Promise((resolve, reject) => {
          setTimeout(() => {
          console.log('DONE get UserData');
          resolve()
        }, 9000);
      })*/
    },
    apiFindPersona: function({state},payload) {
      console.log('user.apiFindPersona',payload);

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      var response = curl.get('/api/personas',{
        params: payload
      });


      console.log(response);

      return response;
    },
    apiCreatePersona: function({commit,dispatch,state},createPersona) {
      console.log('user.apiCreatePersona',createPersona);

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      // payload.familiar = payload.isFamiliar;

      curl.post('/api/personas',createPersona)
        .then(function (response) {
          // handle success
          if(response.data.persona)
          {
            console.log("Payload esFamiliar?: ",createPersona)
            if(createPersona.familiar)
            { 
              console.log("Es Familiar");
              createPersona.persona_id = response.data.persona.id;
              dispatch("apiCreateFamiliar",createPersona);
              dispatch('apiGetUserData');
            } else {
                console.log("Persona_id: ",response.data.persona.id)
                console.log("AuthApi:Persona_id: ",state.authApi.persona_id)
                createPersona.persona_id = response.data.persona.id;
                createPersona.familiar_id = state.authApi.persona_id;
                dispatch("apiGetFamiliar",createPersona);

                router.push({
                  path: '/inscripciones/finalizar'
                });
            }
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });

    },
    apiUpdatePersona: function({commit,dispatch,state},payload) {
      console.log('user.apiUpdatePersona',payload);

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;
      curl.post('/api/personas/'+state.authApi.persona.id,payload)
          .then(function (response) {
            // handle success
            console.log(response.data);
            if(response.data.updated)
            {
              if(payload.familiar)
              {
                dispatch('apiGetUserData');
              } else {
                // Si es familiar crea el familiar
                if(payload.familiar){
                  payload.persona_id = state.authApi.persona.id;
                  dispatch("apiCreateFamiliar",payload);
                }else{

                }
                router.push({
                  path: '/inscripciones/finalizar'
                });
              }
            } else {
              console.log(response.data);
            }
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
    },
    apiGetFamiliar:function({commit,dispatch,state},payload){
      console.log("obteniendo Familiar..."+payload.familiar_id);
      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.get('/api/v1/familiar/persona/'+payload.familiar_id).then(function(familiar){
        console.log(familiar.data);
        var data = {
          'familiar_id': familiar.data.id,
          'persona_id':payload.persona_id,
          'alumno_id': 0,
          'centro_id': 0,
          'legajo_fisico_nro':0,
          'pendiente':0
        }
        // Se crea el alumno
        dispatch("apiCreateAlumno",data);
        
      });
    },
    apiGetAlumnosForFamiliar:function({commit,state}){

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.get('/api/v1/familiar/persona/'+state.authApi.persona.id).then(function(familiar){
        curl.get('/api/v1/alumnos_familiars/alumnos/'+familiar.data.id).then(function(alumnos){
          commit("retrieveAlumnos",alumnos.data);
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
      
    },
    apiCreateFamiliar:function({commit,dispatch,state},payload){
      console.log('user.apiCreateFamiliar',payload);

      if(!payload.observaciones){
        payload.observaciones = "N/A";
      }
      payload.conviviente = 0;
      payload.autorizado_retirar = 0;
      
      payload._method = "POST";

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.post('/api/v1/familiar',payload)
        .then(function (response) {
          // handle success
          console.log("Familiar: ",response.data);
          if(response.data.familiar.id){
            console.log("Familiar Creado!");
          } else {
            console.log("Algo pasó en la creación del familiar: ",response.data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log("Algo pasó",error);
        });
    },
    apiCreateAlumno: function({commit,dispatch,state},payload){
      console.log('user.apiCreateAlumno',payload);

      payload._method = "POST";

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.post('/api/v1/alumnos',payload)
        .then(function (response) {
          // handle success
          if(response.data.alumno.id){
            console.log("Alumno Creado!");
            payload.alumno_id = response.data.alumno.id;
            // Posteriormente se crea la relación entre el Alumno y el Familiar
            dispatch("apiCreateAlumnoFamiliars",payload);
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    relateAlumnoFamiliars: function({commit,dispatch,state},alumno){
      console.log('user.apiRelateAlumnoFamiliars',alumno);

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.get('/api/v1/familiar/persona/'+state.authApi.persona.id).then(function(familiar){
        console.log(familiar.data);
        var data = {
          'familiar_id': familiar.data.id,
          'persona_id':alumno.id,
          'alumno_id': 0,
          'centro_id': 0,
          'legajo_fisico_nro':0,
          'pendiente':0
        }
        
        alumno.centro_id = 0;
        alumno.persona_id = alumno.id;
        alumno.legajo_fisico_nro = 0;
        curl.post('/api/v1/alumnos',alumno)
        .then(function (response) {
          // handle success
          console.log(response.data);
          if(response.data.alumno.id){
            console.log("Alumno Creado!");
            data.alumno_id = response.data.alumno.id;
            // Posteriormente se crea la relación entre el Alumno y el Familiar
            dispatch("apiCreateAlumnoFamiliars",data);
            router.push({
              path: '/inscripciones/finalizar'
            });
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
        
      });

    },
    apiCreateAlumnoFamiliars: function({commit,dispatch,state},payload){
      console.log('user.apiCreateAlumnoFamiliars',payload);

      payload._method = "POST";
      payload.status = "pendiente";

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      curl.post('/api/v1/alumnos_familiars',payload)
        .then(function (response) {
          console.log(response.data);
          // handle success
          if(response.data.alumnos_familiars.id){
            console.log("Relación Alumno-Familiar Creado!");
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    apiFindDni: function({state},payload){
      console.log('user.apiFindDni',payload);

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;

      var response = curl.get('/api/personas',{
        params: {documento_nro:payload}
      });

      console.log(response);

      return response;
    },
    apiFilterNeighborhood: function({commit,state},payload){

      const curl = axios.create({
        baseURL: process.env.SIEP_API_GW_INGRESS
      });
      // Header con token
      curl.defaults.headers.common['Authorization'] = `Bearer ${state.authToken}`;
      state.apiNeighborhoodFiltering = true;
      curl.get('/api/v1/barrios',{
        params: payload
      }).then(function(response){
        let res = response.data.map(x => {
          return x.nombre
        });
        commit('refillNeighborhood', res); 
        state.apiNeighborhoodFiltering = false;
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
    }
  }
};

export default module
