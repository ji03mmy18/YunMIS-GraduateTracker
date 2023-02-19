<template>
  <v-app>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>雲科大資管系 流向調查系統</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="$mdi-logout" @click="userLogout">登出</v-btn>
    </v-app-bar>
    <v-navigation-drawer>

    </v-navigation-drawer>
    <v-main>

    </v-main>
    <v-footer class="text-center">
      {{ new Date().getFullYear() }} - <a href="https://github.com/ji03mmy18/YunMIS-GraduateTracker/">YunMIS-GraduateTracker</a> Project
    </v-footer>
  </v-app>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const api = inject('api');

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
