<template>
  <div class="infobox">
    <h1>資管系 流向調查問卷<br>填寫完成！</h1>
    <h2>Survey Completed !<br>You can close this page now.</h2>
    <div class="thumbnail"><img src="@/assets/check.svg" alt="main page" width="80" height="80"/></div>
    <div class="locateBtn">
      <button class="mis" @click="mis">回資管系網</button>
      <button class="main" @click="main">回首頁</button>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const main = () => {
  router.push({ name: 'home' });
}
const mis = () => {
  window.location.href = "https://www.mis.yuntech.edu.tw";
}
</script>

<style scoped>
.infobox {
  position: relative;
  background: #ffffff;
  max-width: 480px;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}

h1 {
  margin-top: 0px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 0px;
  margin-bottom: 20px;
}

.thumbnail {
  background: #ed4545;
  width: 150px;
  height: 150px;
  margin: 0px auto 30px auto;
  padding-top: 35px;
  border-radius: 100%;
  box-sizing: border-box;
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

.locateBtn .mis{
  float: left;
}

.locateBtn .main {
  float: right;
}

.clearfix {
  clear: both;
}
</style>
