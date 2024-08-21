<template>
  <div class="infobox">
    <h1>雲科大資管系 畢業生流向問卷調查</h1>
    <br><br>
    <!-- 表單主體 -->
    <form class="form" @submit.prevent="submitForm">
      <!-- 表單第一列：學號 -->
      <div class="form-field">
        <label>學號</label>
        <br><br>
        <input readonly type="text" v-model="user.ID" class="form-control" id="sid">
        <br><br><br>
      </div>

      <!-- 表單第二列：姓名 -->
      <div class="form-field">
        <label>姓名</label>
        <br><br>
        <input readonly type="text" v-model="user.Name" class="form-control" id="sname">
        <br><br><br>
      </div>

      <!-- 表單第三列：性別 -->
      <div class="form-field">
        <label>性別 *</label>
        <br><br>
        <label class="labelR"><input required class="option-input" type="radio" name="sex" v-model="sex" value="男">男性</label>
        <label class="labelR"><input required class="option-input" type="radio" name="sex" v-model="sex" value="女">女性</label>
        <br><br><br>
      </div>

      <!-- 表單第四列：學位 -->
      <div class="form-field">
        <label>就學類型 *</label>
        <br><br>
        <select required class="select-style" v-model="user.Education_type" id="sedutype">
          <option value="四技">四技</option>
          <option value="二技">二技</option>
          <option value="碩士">碩士</option>
          <option value="博士">博士</option>
          <option value="碩士在職專班">碩士在職專班</option>
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
        <input required type="text" class="form-control" v-model="schoolMail" placeholder="請輸入您的學校信箱">
        <br><br><br>
      </div>

      <!-- 表單第六列：私人信箱 -->
      <div class="form-field">
        <label>私人信箱 *</label>
        <br><br>
        <input required type="text" class="form-control" v-model="personalMail" placeholder="請輸入您的私人信箱">
        <br><br><br>
      </div>

      <!-- 表單第七列：FB帳號 -->
      <div class="form-field">
        <label>Facebook帳號(暱稱) *</label>
        <br><br>
        <input required type="text" class="form-control" v-model="fbName" placeholder="請輸入您的Facebook帳號(暱稱)">
        <br><br><br>
      </div>

      <!-- 表單第八列：電話 -->
      <div class="form-field">
        <label>聯絡方式 *</label>
        <br><br>
        <input required type="text" class="form-control" v-model="phoneNo" placeholder="請輸入您的電話或是手機">
        <br><br><br>
      </div>

      <!-- 表單第九列：地址 -->
      <div class="form-field">
        <label>地址 *</label>
        <br><br>
        <input required type="text" class="form-control" v-model="address" placeholder="請輸入您的地址">
        <br><br><br>
      </div>

      <!-- 表單第十列：指導老師 -->
      <div class="form-field">
        <label>指導(專題)老師 *</label>
        <br><br>
        <input required type="text" class="form-control" v-model="teacher" placeholder="請輸入您的指導老師姓名">
        <br><br><br>
      </div>

      <!-- 表單第十一列：畢業年 -->
      <div class="form-field">
        <label>畢業年份</label>
        <br><br>
        <input readonly type="text" class="form-control" v-model="user.Year" id="syear">
        <br><br><br>
      </div>

      <!-- 表單第十二列：目前狀態 -->
      <div class="form-field">
        <label>目前狀態 *</label>
        <br><br>
        <select required class="select-style" v-model="currState" v-on:change="stateChange">
          <option value="就業">就業</option>
					<option value="升學">升學</option>
					<option value="服兵役">服兵役</option>
					<option value="延畢">延畢</option>
					<option value="出國留學">出國留學</option>
					<option value="其他">其他</option>
        </select>
        <br><br><br>
      </div>

      <!-- 表單第十三列：狀態詳述 -->
      <div class="form-field">
        <label>狀態詳述 *</label>
        <br><br>
        <div v-if="currState == '升學' || currState == '出國留學'">
          <input required type="text" v-model="detailOne" placeholder="請輸入升學或留學的學校名稱">
          <input required type="text" v-model="detailTwo" placeholder="請輸入升學或留學的學校科系">
        </div>
        <div v-if="currState == '就業'">
          <input required type="text" v-model="detailOne" placeholder="請輸入預計就業的公司名稱">
          <input required type="text" v-model="detailTwo" placeholder="請輸入預計就業的公司職稱">
        </div>
        <div v-if="currState == '延畢' || currState == '服兵役'">
          <input type="text" v-model="detailOne">
        </div>
        <div v-if="currState == '其他'">
          <input required type="text" v-model="detailOne" placeholder="請描述目前的狀態">
        </div>
        <br><br>
      </div>

      <!-- 表單結尾：送出或重填 -->
      <div>
        <button class="resetBtn" @click="resetForm">重新填寫</button>
        <button class="submitBtn" type="submit">送出問卷</button>
      </div>
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
import { ref, inject } from 'vue';
import router from '@/router';
import { useUserStore } from '@/store/userStore';

const user = useUserStore();
const api = inject('api')
const apiErr = ref(false);
const apiMsg = ref('');
const redirect = ref(false);

const sex = ref('');
let schoolMail = user.ID.toLowerCase() + "@yuntech.edu.tw";
const personalMail = ref('');
const fbName = ref('');
const phoneNo = ref('');
const address = ref('');
const teacher = ref('');
const currState = ref('就業');
const detailOne = ref('');
const detailTwo = ref('');

const stateChange = () => {
  currState.value == '延畢' || currState.value == '服兵役' ? detailOne.value = '本題無需填寫。' : detailOne.value = '';
}

const resetForm = () => {
  sex.value = '';
  personalMail.value = '';
  fbName.value = '';
  phoneNo.value = '';
  address.value = '';
  teacher.value = '';
  currState.value = '就業';
  detailOne.value = '';
  detailTwo.value = '';
}

const closeDialog = () =>  {
  apiMsg.value = '';
  apiErr.value = false;
  router.push({ name: 'home' });
}

const submitForm = () => {
  api.post('/data/save', {
    id: user.ID,
    sex: sex.value,
    eduType: user.Education_type,
    schoolMail: schoolMail,
    otherMail: personalMail.value,
    fbid: fbName.value,
    phone: phoneNo.value,
    address: address.value,
    teacher: teacher.value,
    status: currState.value,
    statusDetail: `${detailOne.value}|${detailTwo.value}`
  }).then((res) => {
    switch(res.status) {
      case 200:
        if (res.data.status) {
          router.push({ name: 'done' });
        } else {
          if (res.data.msg == 'Finished') {
            apiMsg.value = '此學號已經完成填寫，若有疑惑，請聯絡資管系辦詢問。';
            apiErr.value = true;
          }
          if (res.data.msg == 'NotFound') {
            apiMsg.value = '未找到此學號，若有疑惑，請聯絡資管系辦詢問。';
            apiErr.value = true;
          }
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch((err) => {
    let res = err.response;
    switch(res.status) {
      case 500:
        if (res.data.msg == 'StoreError') {
          apiMsg.value = '在儲存您的資料時發生錯誤，請聯絡資管系辦詢問！';
          apiErr.value = true;
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
  max-width: 600px;
  margin: 2rem;
  padding: 30px;
  border-radius: 20px;
  text-align: start;
}

h1 {
  margin-top: 0px;
  margin-bottom: 15px;
  text-align: center;
}

.form label {
  font-size: 18px;
}

.form input[type="text"] {
  background: rgb(250, 250, 250);
  width: 90%;
  margin: 0px 0px 0px 0px;
  padding: 10px 0px 10px 5px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  box-sizing: content-box;
  font-size: 110%;
  transition: background-color 0.25s;
}

.form input[type="text"]:hover {
  background-color: rgb(245, 245, 245);
}

.form input[type="radio"] {
  height: 30px;
  width: 30px;
  padding: 0px;
  margin: 0px 5px 0px 5px;
  position: relative;
  top: 8px;
  appearance: none;
  background: #cbd1d8;
  cursor: pointer;
  border-radius: 20%;
  transition: all 0.25s ease-out 0s;
}

.form input[type="radio"]:hover {
  background: #9faab7;
}

.form input[type="radio"]:checked {
  background: #40c0d0;
}

.form .labelR {
  margin: 0px 10px 0px 0px;
}

.form .select-style {
  background: #fafafa;
  width: 90%;
  margin: 0px 0px 0px 0px;
  padding: 10px 0px 10px 5px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  box-sizing: content-box;
  font-size: 110%;
  transition: background-color 0.25s
}

.form .select-style:hover {
  background: rgb(245, 245, 245);
}

.form .submitBtn {
  width: 40%;
  height: 50px;
  margin: 5px 0px 0px 0px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  padding: 0.4em 0.8em;
  font-size: 1.2em;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  float: right;
  background: #ee5b5b;
}

.form .resetBtn {
  width: 40%;
  height: 50px;
  margin: 5px 0px 0px 0px;
  border-radius: 4px;
  border: 1px solid rgb(224, 224, 224);
  padding: 0.4em 0.8em;
  font-size: 1.2em;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  background: #000000;
}
</style>
