// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// Google Maps
// import * as VueGoogleMaps from "vue2-google-maps";

// Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import _ from 'lodash';

// MomentJS
import moment from 'moment'

// Sweet Alert
import VueSwal from 'vue-swal'

// Material Designs Icons
import "vue-material-design-icons/styles.css"

// Source
import router from './router'
import store from './store'

// ScrollTo
import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })

Vue.use(Vuetify);
Vue.use(VueSwal);
Vue.config.productionTip = false;

Vue.filter('fechaSinHora', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
});

Vue.filter('fechaConHora', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: "AIzaSyBFPUFES_l4Gn4QKty9nwXTdeM-Ew-Hxb8",
//     libraries: "places" // necessary for places input
//   }
// });

// Vue Analytics
// import VueAnalytics from 'vue-analytics';

const isProd = process.env.NODE_ENV === 'production';

// Vue.use(VueAnalytics,{
//   id:'UA-138532724-1',
//   router,
//   autoTracking:{
//     exception: true
//   },
//   debug:{
//     enabled: !isProd,
//     sendHitTask: isProd
//   }
// });

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
