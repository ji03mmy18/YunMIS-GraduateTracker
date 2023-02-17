<template>
  <div class="infobox">
    <h1>畢業生流向調查系統</h1>
    <div class="thumbnail"><img src="@/assets/hat.svg" alt="main page" /></div>
    <form class="form" @submit.prevent="getInfo">
      <input required class="sid" type="text" v-model="id" placeholder="請填入您的學號">
      <vue-hcaptcha sitekey="c141ec95-c510-46de-9001-2526342cd0ef" @verify="verify"></vue-hcaptcha>
      <button type="submit">點我填寫</button>
    </form>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

let id = "";
let token = "";
let eKey = "";
const api = inject('api');
const router = useRouter();
const user = useUserStore();

const verify = (tokenStr, ekey) => {
  token = tokenStr;
  eKey = ekey;
}

const getInfo = () => {
  api.post('/data', { id, token })
    .then((res) => {
      switch(res.status) {
        case 200:
          if (res.data.status) {
            user.storeUser(res.data.user);
            router.push({ name: 'form' });
          } else {
            console.log(res.data);
          }
          break;
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
  max-width: 300px;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}

h1 {
  margin-top: 0px;
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

.sid {
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

.sid:hover {
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
</style>
