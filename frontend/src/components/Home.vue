<template>
  <div class="infobox">
    <div class="thumbnail"><img src="@/assets/hat.svg" alt="main page" /></div>
    <form class="form">
      <input class="sid" type="text" name="id" id="id" placeholder="請填入您的學號">
      <vue-hcaptcha sitekey="test"></vue-hcaptcha>
      <button type="submit">點我填寫</button>
    </form>
  </div>
</template>

<script setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
</script>

<style scoped>

.infobox {
  position: relative;
  background: #ffffff;
  max-width: 300px;
  margin: 0px auto 100px auto;
  padding: 30px;
  border-radius: 5%;
  text-align: center;
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
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  border-color: rgb(224, 224, 224);
  box-sizing: content-box;
  text-align: center;
  font-family: 'Microsoft JhengHei';
  font-weight: bolder;
  font-size: 150%;
}

</style>
