import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
  mdiLogout, mdiGithub, mdiGmail, mdiArchive, mdiPencil, mdiBoomGate,
  mdiDatabaseEditOutline, mdiDatabaseImport,
  mdiAccountEditOutline, mdiAccountSearch,
} from '@mdi/js';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      "mdi-archive": mdiArchive,
      "mdi-boomGate": mdiBoomGate,
      "mdi-github": mdiGithub,
      "mdi-gmail": mdiGmail,
      "mdi-logout": mdiLogout,
      "mdi-pencil": mdiPencil,
      "mdi-dbEditOut": mdiDatabaseEditOutline,
      "mdi-dbImport": mdiDatabaseImport,
      "mdi-accEditOut": mdiAccountEditOutline,
      "mdi-accSearch": mdiAccountSearch,
    },
    sets: { mdi }
  },
  components,
  directives
});

export default vuetify;
