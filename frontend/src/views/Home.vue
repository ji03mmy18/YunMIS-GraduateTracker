<template>
  <div class="infobox">
    <h1>畢業生流向調查系統</h1>
    <div class="thumbnail"><img src="@/assets/hat.svg" alt="main page" /></div>
    <form class="form" @submit.prevent="getInfo">
      <input required class="sid" type="text" v-model="id" placeholder="請填入您的學號">
      <Transition name="admin">
        <div v-if="id == 'manage'">
          <input required class="account" type="text" v-model="account" placeholder="請輸入管理員帳號">
          <input required class="passwd" type="password" v-model="passwd" placeholder="請輸入管理員密碼">
        </div>
      </Transition>
      <vue-hcaptcha sitekey="c141ec95-c510-46de-9001-2526342cd0ef" @verify="verify"></vue-hcaptcha>
      <button type="submit">點我填寫</button>
    </form>
  </div>
  <v-dialog v-model="apiErr" persistent width="600">
    <v-card>
      <v-card-text>
        {{ apiMsg }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="closeDialog">關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useUserStore, useManagerStore } from '@/store';

const user = useUserStore();
const manager = useManagerStore();
const router = useRouter();
const api = inject('api');

const id = ref('');
const token = ref('');
const eKey = ref('');
const account = ref('');
const passwd = ref('');
const apiErr = ref(false);
const apiMsg = ref('');
const pageReload = ref(false);

const verify = (tokenStr, ekey) => {
  token.value = tokenStr;
  eKey.value = ekey;
}

const closeDialog = () =>  {
  apiMsg.value = '';
  apiErr.value = false;
  if (pageReload.value) {
    window.location.reload();
  }
}

const getInfo = () => {
  id.value == 'manage' ? managerReq() : studentReq();
}

const managerReq = () => {
  api.post('/manage/login', {
    user: account.value,
    pass: passwd.value,
    token: token.value,
  }).then((res) => {
    switch(res.status) {
      case 200:
        if (res.data.status) {
          manager.storeManager(res.data.user);
          router.push({ name: 'mgmtHome' });
        }
        break;
      default:
        console.log(res.data);
    }
  }).catch((err) => {
    let res = err.response;
    console.log(err);
    console.log(res);
  });
}

const studentReq = () => {
  api.post('/data', {
    id: id.value,
    token: token.value,
  }).then((res) => {
    switch(res.status) {
      case 200:
        if (res.data.status) {
          user.storeUser(res.data.user);
          router.push({ name: 'form' });
        } else {
          if (res.data.msg == 'Finished') {
            apiMsg.value = '您已經完成流向調查問卷的填寫，無需再次填寫！';
            apiErr.value = true;
            pageReload.value = true;
          }
        }
        break;
      default:
        console.log(res.status);
        console.log(res.data);
    }
  }).catch((err) => {
    let res = err.response;
    switch(res.status) {
      case 400:
        if (res.data.msg == 'CaptchaNotFound') {
          apiMsg.value = '請勾選hCaptcha驗證後，再次進行填寫！';
          apiErr.value = true;
        }
        break;
      case 404:
        if (res.data.msg == 'NotFound') {
          apiMsg.value = '您所輸入的學號無效，請重新輸入後，再嘗試一次！';
          apiErr.value = true;
          pageReload.value = true;
        }
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  });
}
</script>

<style scoped>
.infobox {
  position: relative;
  background: #ffffff;
  max-width: 360px;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}

h1 {
  margin-top: 0px;
  margin-bottom: 20px;
}

.thumbnail {
  background: #ef3b3a;
  width: 150px;
  height: 150px;
  margin: 0px auto 30px auto;
  padding: 50px 30px;
  border-radius: 100%;
  box-sizing: border-box;
}

.form input {
  outline: 0;
  background:rgb(250, 250, 250);
  width: 100%;
  margin: 0px 0px 15px 0px;
  padding: 15px 0px 15px 0px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  box-sizing: content-box;
  text-align: center;
  font-family: 'Microsoft JhengHei';
  font-weight: bolder;
  font-size: 150%;
  transition: background-color 0.25s;
}

.form input:hover {
  background-color: rgb(245, 245, 245);
}

button {
  margin: 5px 0px 0px 0px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  padding: 0.4em 0.8em;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #3b3b3b;
}

button:focus,
button:focus-visible {
  outline: 1px auto;
}

.admin-enter-active,
.admin-leave-active {
  transition: opacity 0.5s ease;
}

.admin-enter-from,
.admin-leave-to {
  opacity: 0;
}
</style>
