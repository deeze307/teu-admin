<template>
  <div>
    <v-toolbar flat dark xs12 sm12 md12 lg12>
      <v-toolbar-title>Empleos publicados</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mb-2" @click="addItem()">Nueva Oferta de Empleo</v-btn>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="pt-2 pb-0">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md class="pt-0 pb-0">
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12>
                  <v-text-field v-model="editedItem.titulo" label="Titulo"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 class="pt-0 pb-0">
                  <v-textarea
                    v-model="editedItem.descripcion"
                    label="Descripción del Empleo"
                    counter="500"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 sm6 md6 lg6 class="pt-0 pb-0">
                  <v-text-field v-model="editedItem.movil" label="Teléfono"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6 lg6 class="pt-0 pb-0">
                  <v-combobox
                    v-model="editedItem.categoria"
                    :items="empleos_categorias"
                    item-text="categoria_nombre"
                    item-value="categoria_nombre"
                    label="Seleccione Categoría"
                    hint="Campo Requerido"
                    :loading="loadingCategorias"
                    required
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 sm8 md8 lg8 class="pt-0 pb-0">
                  <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                </v-flex>
                <v-flex xs12 sm5 md5 lg5 class="pt-0 pb-0">
                  <v-switch
                    v-model="editedItem.visible_web"
                    label="Visible Web"
                  ></v-switch>
                </v-flex>
                <v-flex xs12 sm5 md5 lg5 class="pt-0 pb-0">
                  <v-switch
                    v-model="editedItem.visible_movil"
                    label="Visible Móvil"
                  ></v-switch>
                </v-flex>
                <v-flex xs12 sm5 md5 lg5 class="pt-0 pb-0">
                  <v-switch
                    v-model="editedItem.puesto_cubierto"
                    label="Puesto Cubierto"
                  ></v-switch>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click="close">Cancelar</v-btn>
            <v-btn v-if="this.editedIndex === -1" color="green darken-1" flat @click="save" :loading="saving">Guardar</v-btn>
            <v-btn v-if="this.editedIndex !== -1" color="green darken-1" flat @click="update" :loading="saving">Actualizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <!-- Datatable -->
    <v-flex xs12 sm12 md12 lg12>
      <v-data-table
      :headers="headers"
      :items="response"
      :loading="loading"
      no-data-text="No hay datos"
      hide-actions
      class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.titulo }}</td>
          <td class="text-xs-center"><v-icon small v-if="props.item.visible_web">desktop_windows</v-icon><v-icon small v-if="props.item.visible_movil">phone_android</v-icon></td>
          <td class="text-xs-center">{{ props.item.categoria }}</td>
          <td class="text-xs-center"><v-icon v-if="props.item.puesto_cubierto">block</v-icon> <v-icon v-if="!props.item.puesto_cubierto">done</v-icon></td>
          <td class="text-xs-center">{{ props.item.createdAt | fechaSinHora }}</td>
          <td class="text-xs-center">
            <v-icon
              small
              class="mr-1"
              @click="showPersonInfo(props.item)"
            >
            visibility
            </v-icon>
            <v-icon
              small
              class="mr-1"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-flex>
    <!-- ./Datatable -->
    
    <br>

    <v-dialog
            v-model="dialog_ops.dialog"
            max-width="490"
    >
      <v-card>
        <v-card-title class="headline">{{dialog_ops.dialogTitle}}</v-card-title>
        <v-card-text>
          <div>
            <strong><u>Titulo:</u></strong> {{dialog_ops.dialogContent.titulo}}
          </div>
          <div>
            <strong><u>Descripción:</u></strong> {{dialog_ops.dialogContent.descripcion}}
          </div>
          <div>
            <strong><u>Teléfono:</u></strong> {{dialog_ops.dialogContent.movil}}
          </div>
          <div>
            <strong><u>Visible Web:</u></strong> <span v-if="dialog_ops.dialogContent.visible_web">SI</span><span v-if="dialog_ops.dialogContent.visible_web">NO</span>
          </div>
          <div>
            <strong><u>Visible Móvil:</u></strong> <span v-if="dialog_ops.dialogContent.visible_movil">SI</span><span v-if="dialog_ops.dialogContent.visible_movil">NO</span>
          </div>
          <div>
            <strong><u>Puesto Cubierto:</u></strong> <span v-if="dialog_ops.dialogContent.puesto_cubierto">SI</span><span v-if="dialog_ops.dialogContent.puesto_cubierto">NO</span>
          </div>
          <div>
            <strong><u>Email:</u></strong> {{dialog_ops.dialogContent.email}}
          </div>
          <div>
            <strong><u>Categoría:</u></strong> {{dialog_ops.dialogContent.categoria}}
          </div>
          <div>
            <strong><u>Creación:</u></strong> {{dialog_ops.dialogContent.createdAt | fechaSinHora}}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="dialog_ops.dialog = false"
          >Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Pagination -->
    <p class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="response.last_page"
        :total-visible="7"
      />
    </p>
    <!-- ./Pagination -->

  </div>

</template>

<script>
  import axios from 'axios'

  export default {
    components:{
    },
    props: ['query'],
    data () {
      return {
        headers: [
          { text: 'Titulo', value: 'titulo' , sortable: false, align: 'center' },
          { text: 'Visible', value: 'visible_web' , sortable: false, align: 'center' },
          { text: 'Categoría', value: 'categoría' , sortable: false, align: 'center' },
          { text: 'Disponible', value: 'puesto_cubierto' , sortable: false, align: 'center' },
          { text: 'Creación', value: 'createdAt' , sortable: false, align: 'center' },
          { text: 'Acciones', value: '' , sortable: false, align: 'center' }
        ],
        response: [],
        empleos_categorias:[],
        count:0,
        pages:0,

        excel: {
          download: false,
          error: false,
          error_message: false,
          snackbar: false,
          limite: 3000,
          partes: 0
        },
        dialog:false,
        editedIndex: -1,
        editedItem:{
          titulo:'',
          descripcion:'',
          movil:'',
          email:'',
          empleos_categoria:{},
        },
        defaultItem: {
          titulo:'',
          descripcion:'',
          movil:'',
          email:'',
          empleos_categoria:{}
        },
        dialog_ops:{
          dialog: false,
          buttonName:"",
          dialogTitle:"Información de Empleo",
          dialogContent:[],
          icon:"visibility"
        },

        apigw: process.env.TEU_API,
        page: 1,
        loading: true,
        saving:false,
        loadingCategorias:false,
        error: false,
        error_message: '',
        details_loading: false
      }
    },
    computed:{
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva Oferta de Empleo' : 'Editando Oferta de Empleo'
      }
    },
    created: function () {
      this.getData();
      this.getCategorias();
    },
    watch: {
      page: function() {
        this.query.page = this.page;
        this.getData();
      },
      query: {
        handler() {
          // Cada vez que cambia la query, retorno a la primer pagina
          this.page = 1;
          this.getData();
        },
        deep: true
      },
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      getData() {
        let vm = this;
        vm.loading = true;
        vm.error = false;

        axios.get(vm.apigw+'/empleo',{
          params: vm.query
        })
        .then(function (response) {
          vm.response = response.data.payload;
          vm.count = response.data.count;
          vm.pages = response.data.pages;
          vm.loading = false;

          if(vm.response.total) {
            vm.excel.partes = Math.ceil(vm.response.total / vm.excel.limite);
          }
        })
        .catch(function (error) {
          vm.error = true;
          vm.error_message = error.message;
          vm.loading = false;
        });
      
      },
      getCategorias(){
        let vm = this;
        vm.loadingCategorias = true;
        vm.error = false;
        axios.get(vm.apigw+'/categoria',{
          params: vm.query
        })
        .then(function (response) {
          vm.empleos_categorias = response.data.payload;
          vm.loadingCategorias = false;

        })
        .catch(function (error) {
          vm.error = true;
          vm.loadingCategorias = false;
          vm.error_message = error.message;
        });
      },
      addItem(){
        this.dialog = true;
      },
      editItem (item) {
        this.editedIndex = this.response.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.visible_web = item.visible_web;
        this.editedItem.visible_movil = item.visible_movil;
        this.dialog = true
      },
      deleteItem (item) {
        let vm = this;
        swal({
          title: "Estás seguro?",
          text: "Una vez eliminado, No podrás Retractarte!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            const curl = axios.create({
              baseURL: process.env.TEU_API
            });
            curl.delete(`/empleo/${item.id}`)
            .then(function (response){
              if(response.data.ok){
                vm.saving = false;
                swal("Poof!!! Tu Oferta de Empleo DESAPARECIÓ!", {
                  icon: "success",
                });
                vm.getData();
                vm.close()
              }else{
                swal("Upss! Algo pasó", response.data, "warning");
                vm.saving = false;
              }
            })
            .catch(function (error) {
              // handle error
              swal("Upss! Ocurrió un error", error, "error");
              vm.saving = false;
            });
            
          } else {
            swal("Feewww!!","El Empleo se salvó!","info");
          }
        });
      },
      close () {
        this.saving = false;
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        let vm = this;
        vm.saving = true;
        if (vm.editedIndex > -1) {
          Object.assign(vm.response[vm.editedIndex], vm.editedItem)
        } else {
          const curl = axios.create({
            baseURL: process.env.TEU_API
          });
          vm.editedItem.categoria = vm.editedItem.categoria.categoria_nombre;
          vm.editedItem.visible_web = vm.editedItem.visible_web;
          vm.editedItem.visible_movil = vm.editedItem.visible_movil;
          vm.editedItem.puesto_cubierto = false;
          curl.post('/empleo',vm.editedItem)
            .then(function (response){
              if(response.data.ok){
                vm.saving = false;
                swal("Genial!", "Creaste una Oferta de Empleo!", "success");
                vm.getData();
                vm.close()
              }else{
                swal("Upss! Algo pasó", response.data, "warning");
                vm.saving = false;
              }
            })
            .catch(function (error) {
              // handle error
              swal("Upss! Ocurrió un error", error, "error");
              vm.saving = false;
            });
        }
        
      },
      update () {
        let vm = this;
        vm.saving = true;
        
        const curl = axios.create({
          baseURL: process.env.TEU_API
        });
        vm.editedItem.id_categoria = vm.editedItem.categoria;
        vm.editedItem.visible_web = vm.editedItem.visible_web;
        vm.editedItem.visible_movil = vm.editedItem.visible_movil;
        curl.put(`/empleo/${vm.editedItem.id}`,vm.editedItem)
          .then(function (response){
            if(response.data.ok){
              vm.saving = false;
              swal("Genial!", "Tu Oferta de Empleo se Actualizó!", "success");
              vm.getData();
              vm.close()
            }else{
              swal("Upss! Algo pasó", response.data, "warning");
              vm.saving = false;
            }
          })
          .catch(function (error) {
            // handle error
            swal("Upss! Ocurrió un error", error, "error");
            vm.saving = false;
          });
        
      },
      showPersonInfo(empleo){
        let vm = this;
        vm.dialog_ops.dialogContent = empleo;
        vm.dialog_ops.dialogContent.categoria = empleo.empleos_categoria.categoria_nombre;
        vm.dialog_ops.dialog = true;
      }
    }
  }
</script>
<style>
  body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}
</style>  
