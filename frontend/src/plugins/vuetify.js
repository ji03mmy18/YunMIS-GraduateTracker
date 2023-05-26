import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
  mdiLogout, mdiGithub, mdiGmail, mdiArchive, mdiPencil, mdiBoomGate,
  mdiDatabaseEditOutline, mdiDatabaseImport, mdiAccountEditOutline,
  mdiAccountSearch, mdiFilter, mdiMagnify, mdiEye, mdiEyeOff,
} from '@mdi/js';
import { VDataTable } from 'vuetify/labs/VDataTable';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      "mdi-archive": mdiArchive,
      "mdi-boomGate": mdiBoomGate,
      "mdi-eye": mdiEye,
      "mdi-eye-off": mdiEyeOff,
      "mdi-filter": mdiFilter,
      "mdi-github": mdiGithub,
      "mdi-gmail": mdiGmail,
      "mdi-logout": mdiLogout,
      "mdi-magnify": mdiMagnify,
      "mdi-pencil": mdiPencil,
      "mdi-dbEditOut": mdiDatabaseEditOutline,
      "mdi-dbImport": mdiDatabaseImport,
      "mdi-accEditOut": mdiAccountEditOutline,
      "mdi-accSearch": mdiAccountSearch,
    },
    sets: { mdi }
  },
  components: {
    ...components,
    VDataTable
  },
  directives
});

export default vuetify;
