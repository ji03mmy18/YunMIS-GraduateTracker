import { createApp } from 'vue';
import router from '@/router';
import pinia from '@/store';
import api from '@/axios';
import './style.css'
import App from './App.vue'

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiLogout } from '@mdi/js';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const app = createApp(App);
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      "mdi-logout": mdiLogout
    },
    sets: { mdi }
  },
  components,
  directives
});
app.provide('api', api);
app.use(vuetify);
app.use(router);
app.use(pinia);
app.mount('#app');
