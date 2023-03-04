import { createApp } from 'vue';
import router from '@/router';
import pinia from '@/store';
import api from '@/axios';
import vuetify from '@/plugins/vuetify';

import '@/style.css'
import 'vuetify/styles';
import App from './App.vue'

const app = createApp(App);
app.provide('api', api);
app.use(vuetify);
app.use(router);
app.use(pinia);
app.mount('#app');
