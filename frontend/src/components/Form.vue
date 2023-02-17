<template>
  <div class="infobox">
    <h1>雲科大 資管系</h1>
    <h1>畢業生流向問卷調查</h1>
    <br><br>
    <!-- 表單主體 -->
    <form class="form" @submit.prevent>
      <!-- 表單第一列：學號 -->
      <div class="form-field">
        <label>學號</label>
        <br><br>
        <input readonly type="text" v-model="user.ID" class="form-control">
        <br><br><br>
      </div>

      <!-- 表單第二列：姓名 -->
      <div class="form-field">
        <label>姓名</label>
        <br><br>
        <input readonly type="text" v-model="user.Name" class="form-control">
        <br><br><br>
      </div>

      <!-- 表單第三列：性別 -->
      <div class="form-field">
        <label>性別 *</label>
        <br><br>
        <label><input class="option-input" type="radio" name="sex" id="male" value="男">男性</label>
        <label><input class="option-input" type="radio" name="sex" id="female" value="女">女性</label>
        <br><br>
        <br><br>
      </div>

      <!-- 表單第四列：學位 -->
      <div class="form-field">
        <label>就學類型 *</label>
        <br><br>
        <select class="select-style" v-model="user.Education_type">
          <option value="四技">四技</option>
          <option value="二技">二技</option>
          <option value="碩士">碩士</option>
          <option value="博士">博士</option>
          <option value="碩士在職專班">碩士在謢專班</option>
          <option value="香港二技專班">香港二技專班</option>
          <option value="數位碩士在職專班">數位碩士在職專班</option>
          <option value="其他">其他</option>
        </select>
        <br><br><br>
      </div>

      <!-- 表單第五列：學校信箱 -->
      <div class="form-field">
        <label>學校信箱 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="schoolMail" placeholder="請輸入您的學校信箱">
        <br><br>
      </div>

      <!-- 表單第六列：私人信箱 -->
      <div class="form-field">
        <label>私人信箱 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="personalMail" placeholder="請輸入您的私人信箱">
        <br><br>
      </div>

      <!-- 表單第七列：FB帳號 -->
      <div class="form-field">
        <label>Facebook帳號 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="fbName" placeholder="請輸入您的Facebook帳號">
        <br><br>
      </div>

      <!-- 表單第八列：電話 -->
      <div class="form-field">
        <label>聯絡方式 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="phoneNo" placeholder="請輸入您的電話或是手機">
        <br><br>
      </div>

      <!-- 表單第九列：地址 -->
      <div class="form-field">
        <label>地址 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="address" placeholder="請輸入您的地址">
        <br><br>
      </div>

      <!-- 表單第十列：指導老師 -->
      <div class="form-field">
        <label>指導(專題)老師 *</label>
        <br><br>
        <input type="text" class="form-control" v-model="teacher" placeholder="請輸入您的指導老師姓名">
        <br><br>
      </div>

      <!-- 表單第十一列：畢業年 -->
      <div class="form-field">
        <label>畢業年份</label>
        <br><br>
        <input readonly type="text" class="form-control" v-model="user.Year">
        <br><br>
      </div>

      <!-- 表單第十二列：目前狀態 -->
      <div class="form-field">
        <label>目前狀態 *</label>
        <br><br>
        <select class="select-style" v-model="currState" v-on:change="stateChange">
          <option value="就業">就業</option>
					<option value="升學">升學</option>
					<option value="服兵役">服兵役</option>
					<option value="延畢">延畢</option>
					<option value="出國留學">出國留學</option>
					<option value="其他">其他</option>
        </select>
        <br><br>
      </div>

      <!-- 表單第十三列：狀態詳述 -->
      <div class="form-field">
        <label>狀態詳述 *</label>
        <br><br>
        <input type="text" v-show="currState == '升學' || currState == '出國留學'" v-model="detailOne" placeholder="請輸入升學或留學的學校名稱">
        <input type="text" v-show="currState == '升學' || currState == '出國留學'" v-model="detailTwo" placeholder="請輸入升學或留學的學校科系">
        <input type="text" v-show="currState == '就業'" v-model="detailOne" placeholder="請輸入預計就業的公司名稱">
        <input type="text" v-show="currState == '就業'" v-model="detailTwo" placeholder="請輸入預計就業的公司職稱">
        <input type="text" v-show="currState == '延畢' || currState == '服兵役'" v-model="detailOne">
        <input type="longtext" v-show="currState == '其他'" v-model="detailOne" placeholder="請描述目前的狀態">
        <br><br>
      </div>

    </form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/userStore';

const user = useUserStore();

let schoolMail = user.ID.toLowerCase() + "@yuntech.edu.tw";
let personalMail = "";
let fbName = "";
let phoneNo = "";
let address = "";
let teacher = "";
let currState = "";
let detailOne = "";
let detailTwo = "";

const show = () => {
  console.log(user.ID, user.Name, user.Education_type, user.Year);
}

const stateChange = () => {
  currState == '延畢' || currState == '服兵役' ? detailOne = '本題無需填寫。' : detailOne = '';
}
</script>

<style scoped>
.infobox {
  position: relative;
  background: #ffffff;
  max-width: 600px;
  padding: 30px;
  border-radius: 20px;
  text-align: start;
}

h1 {
  margin-top: 0px;
  margin-bottom: 15px;
  text-align: center;
}
</style>
