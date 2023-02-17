import { createApp } from 'vue';
import router from '@/router';
import pinia from '@/store';
import api from '@/axios';
import './style.css'
import App from './App.vue'

// import 'vuetify/styles';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';

const app = createApp(App);
// const vuetify = createVuetify({
//   components,
//   directives
// });
app.provide('api', api);
app.use(router);
app.use(pinia);
app.mount('#app');
