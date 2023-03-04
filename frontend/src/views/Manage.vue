<template>
  <v-app>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="trigDrawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title style="text-align: start;">雲科大資管系 流向調查系統</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="$mdi-logout" @click="userLogout">登出</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawerOpen" expand-on-hover rail style="text-align: start;">
      <v-list>
        <v-list-item title="測試人員" subtitle="test">
          <template v-slot:prepend>
            <v-avatar color="#40E0D0">
              <span class="text-h6">測</span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav>
        <v-list-group value="DataManagement">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="$mdi-dbEditOut"
              title="資料管理"
            ></v-list-item>
          </template>
          <v-list-item
            v-for="item in drawerDataOptions"
            :key="item.ico"
            :title="item.title"
            :prepend-icon="item.ico"
            :value="item.title"
            @click="router.push({ name: item.route })"
          ></v-list-item>
        </v-list-group>
        <v-list-group value="AccountManagement">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="$mdi-accEditOut"
              title="帳號管理"
            ></v-list-item>
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app elevation="12" height="30">
      <div class="d-flex w-100 align-center" style="gap: 4px">
        {{ new Date().getFullYear() }} - <strong>YunMIS-GraduateTracker</strong>
        <v-spacer></v-spacer>
        <v-btn
          v-for="icon in footerIcon"
          class="mx-4"
          variant="text"
          :key="icon.ico"
          :icon="icon.ico"
          :href="icon.url"
          target="_blank"
        ></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const api = inject('api');

const drawerOpen = ref(true);
const drawerDataOptions = ref([{
  ico: '$mdi-accSearch',
  title: '學生查詢',
  route: 'dataQuery'
}, {
  ico: '$mdi-dbImport',
  title: '批次操作',
  route: 'dataBatch'
}])
const footerIcon = ref([{
  ico: '$mdi-github',
  url: 'https://github.com/ji03mmy18/YunMIS-GraduateTracker/',
}, {
  ico: '$mdi-gmail',
  url: 'mailto:aaaa1234567891016@gmail.com?subject=[流向調查系統問題回報]:<單位名稱>',
}]);

const trigDrawer = () => drawerOpen.value = !drawerOpen.value;
const userLogout = () => {
  api.get('/manage/logout').then((res) => {
    if (res.status == 200 && res.data.msg == 'LoggedOut') {
      router.push({ name: 'home' });
    } else {
      console.log(res.data);
    }
  })
}
</script>

<style scoped>
</style>
