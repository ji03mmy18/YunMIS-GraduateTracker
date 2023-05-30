<template>
  <div class="infobox">
    <h1>資管系 流向調查問卷<br>本系統僅限校內填寫！</h1>
    <div class="thumbnail"><img src="@/assets/forbid.svg" alt="main page" width="150" height="150"/></div>
    <div class="locateBtn">
      <button class="mis" @click="mis">回資管系網</button>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script setup>
const mis = () => {
  window.location.href = "https://www.mis.yuntech.edu.tw";
}
</script>

<style scoped>
.infobox {
  position: relative;
  background: #ffffff;
  max-width: 400px;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}

h1 {
  margin-top: 0px;
  margin-bottom: 20px;
}

.thumbnail {
  background: #000000;
  width: 150px;
  height: 150px;
  margin: 0px auto 30px auto;
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
  float: right;
}


.clearfix {
  clear: both;
}
</style>
