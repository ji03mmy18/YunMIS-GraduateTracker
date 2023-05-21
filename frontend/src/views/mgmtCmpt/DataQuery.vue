<template>
  <!-- 主要功能區塊 -->
  <v-container fluid>
    <div class="d-flex align-center w-100 ma-2 pa-2" style="gap: 4px;">
      <h1 class="font-weight-bold flex-grow-0 ma-0">學生查詢</h1>
      <v-btn
        @click="newStudentDialog = true"
        class="mx-4 flex-grow-0"
        color="info"
      >新增學生
      </v-btn>
      <v-btn
        @click="yearSelectDialog = true"
        class="mx-4 flex-grow-0"
        color="success"
      >切換年份
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchKeyword"
        density="compact"
        variant="solo"
        label="輸入關鍵字查詢"
        append-inner-icon="$mdi-magnify"
        single-line
        hide-details
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div class="d-flex align-start w-100 ma-2 pa-2" style="gap: 4px;">
      <div style="width: 20%;">
        <h2>教育類型</h2>
        <v-radio-group v-model="preferEduType">
          <v-radio
            label="全部"
            value="all"
          ></v-radio>
          <v-radio
            label="四技"
            value="四技"
          ></v-radio>
          <v-radio
            label="二技"
            value="二技"
          ></v-radio>
          <v-radio
            label="碩士"
            value="碩士"
          ></v-radio>
          <v-radio
            label="博士"
            value="博士"
          ></v-radio>
          <v-radio
            label="碩士在職專班"
            value="碩士在職專班"
          ></v-radio>
          <v-radio
            label="香港二技專班"
            value="香港二技專班"
          ></v-radio>
          <v-radio
            label="數位碩在專班"
            value="數位碩士在職專班"
          ></v-radio>
          <v-radio
            label="其他"
            value="其他"
          ></v-radio>
          <v-radio
            label="未設定"
            :value="null"
          ></v-radio>
        </v-radio-group>
      </div>
      <v-divider vertical></v-divider>
      <v-data-table
        :items="tableDataWithType"
        :headers="tableHeader"
        :search="searchKeyword"
        density="compact"
        @click:row="tableClickOnRow"
      ></v-data-table>
    </div>
  </v-container>
  <!-- 新增學生對話框 -->
  <v-dialog v-model="newStudentDialog" width="40%">
    <v-form ref="newStudentForm" v-model="newStudentValid" @submit.prevent="newStudentSubmit">
      <v-card title="新增單筆學生">
        <v-card-text>
          <v-text-field
            label="學生學號"
            v-model="newStudentFormData.id"
            :rules="ruleStudentID"
          ></v-text-field>
          <v-text-field
            label="學生姓名"
            v-model="newStudentFormData.name"
            :rules="ruleNotBlank"
          ></v-text-field>
          <v-select
            label="教育類型"
            :items="['四技', '二技', '碩士', '博士', '碩士在職專班', '香港二技專班', '數位碩士在職專班', '其他']"
            v-model="newStudentFormData.eduType"
            :rules="ruleNotSelect"
          ></v-select>
          <v-text-field
            label="畢業年份"
            v-model="newStudentFormData.year"
            :rules="ruleYear"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            width="30%"
            @click="newStudentDialog = false"
          >取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            type="submit"
            :disabled="!newStudentValid"
          >儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <!-- 修改年份對話框 -->
  <v-dialog v-model="yearSelectDialog" width="30%">
    <v-form ref="yearSelectForm" v-model="yearSelectValid" @submit.prevent="yearSelectSubmit">
      <v-card title="切換年份">
        <v-card-text>
          <v-radio-group v-model="yearSelectFormData.type" @change="yearFieldCheck">
            <v-radio
              label="所有年份"
              color="success"
              value="0"
            ></v-radio>
            <v-radio
              label="指定畢業年："
              color="success"
              value="1"
            ></v-radio>
          </v-radio-group>
          <v-text-field
            label="請輸入西元年"
            :rules="ruleYear"
            placeholder="例：2020"
            variant="outlined"
            :disabled="yearFieldDisable"
            v-model="yearSelectFormData.year"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            width="30%"
            @click="yearSelectDialog = false"
          >取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            type="submit"
            :disabled="!yearSelectValid"
          >送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <!-- 學生資料對話框 -->
  <v-dialog v-model="studentInfoDialog" width="40%" scrollable>
    <v-form ref="studentInfoForm">
      <v-card title="學生詳細資料">
        <v-divider></v-divider>
        <v-card-text style="height: 70vh;">
          <v-text-field
            label="學號"
            v-model="studentInfoFormData.id"
            :disabled="true"
          ></v-text-field>
          <v-text-field
            label="姓名"
            v-model="studentInfoFormData.name"
          ></v-text-field>
          <v-select
            label="性別"
            v-model="studentInfoFormData.sex"
            :items="['男','女']"
          ></v-select>
          <v-select
            label="教育類型"
            v-model="studentInfoFormData.eduType"
            :items="['四技', '二技', '碩士', '博士', '碩士在職專班', '香港二技專班', '數位碩士在職專班', '其他']"
          ></v-select>
          <v-text-field
            label="學校信箱"
            v-model="studentInfoFormData.schoolMail"
          ></v-text-field>
          <v-text-field
            label="個人信箱"
            v-model="studentInfoFormData.otherMail"
          ></v-text-field>
          <v-text-field
            label="FB帳號"
            v-model="studentInfoFormData.fbid"
          ></v-text-field>
          <v-text-field
            label="手機號碼"
            v-model="studentInfoFormData.phone"
          ></v-text-field>
          <v-text-field
            label="住家地址"
            v-model="studentInfoFormData.address"
          ></v-text-field>
          <v-text-field
            label="指導老師"
            v-model="studentInfoFormData.teacher"
          ></v-text-field>
          <v-select
            label="目前狀況"
            v-model="studentInfoFormData.status"
            :items="['就業', '升學', '服兵役', '延畢', '出國留學', '其他']"
          ></v-select>
          <v-text-field
            label="狀態詳述"
            v-model="studentStatusDetail.detailOne"
          ></v-text-field>
          <v-text-field
            label="狀態詳述2"
            v-model="studentStatusDetail.detailTwo"
            :disabled="['升學', '出國留學', '就業'].indexOf(studentInfoFormData.status) == -1"
          ></v-text-field>
          <v-text-field
            label="畢業年份"
            v-model="studentInfoFormData.year"
          ></v-text-field>
          <v-select
            label="是否完成填寫"
            v-model="studentInfoFormData.complete"
            :items="['Y', 'N']"
          ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            width="30%"
            color="info"
            variant="outlined"
            @click="studentInfoDialog = false"
          >關閉
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            color="error"
            variant="outlined"
            @click="infoDeleteDialog = true"
          >刪除
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            color="success"
            variant="outlined"
            @click="saveStudentInfo"
          >儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <!-- 刪除資料對話框 -->
  <v-dialog v-model="infoDeleteDialog" width="20%">
    <v-card title="確定要刪除嗎？">
      <v-card-actions>
        <v-btn
          width="40%"
          color="info"
          variant="outlined"
          @click="infoDeleteDialog = false"
        >取消
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          width="40%"
          color="error"
          variant="outlined"
          @click="deleteStudentInfo"
        >刪除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 新增成功通知 -->
  <v-snackbar v-model="operationNotify" color="success" timeout="1500">
    <v-alert
      v-model="operationNotify"
      type="success"
      :title="notifyMessage"
    ></v-alert>
  </v-snackbar>
</template>

<script setup>
import router from '@/router';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { inject, ref } from 'vue';

const api = inject('api');
const newStudentDialog = ref(false);
const yearSelectDialog = ref(false);
const studentInfoDialog = ref(false);
const infoDeleteDialog = ref(false);
const newStudentForm = ref(null);
const yearSelectForm = ref(null);
const newStudentValid = ref(false);
const yearSelectValid = ref(false);
const studentInfoForm = ref(null);
const operationNotify = ref(false);
const newStudentFormData = ref({
  id: '',
  name: '',
  eduType: '',
  year: '',
});
const yearSelectFormData = ref({
  type: '1',
  year: new Date().getFullYear().toString()
});
const studentStatusDetail = ref({
  detailOne: '',
  detailTwo: '',
});
const studentInfoFormData = ref({
  id: '',
  name: '',
  sex: '',
  eduType: '',
  schoolMail: '',
  otherMail: '',
  fbid: '',
  phone: '',
  address: '',
  teacher: '',
  status: '',
  statusDetail: '',
  year: 0,
  complete: '',
});
const yearFieldDisable = ref(false);
const notifyMessage = ref('');

// 資料表變數
const tableData = ref([]);
const searchKeyword = ref('');
const preferEduType = ref('all');
const tableHeader = [
  { align: 'center', title: '學號', key: 'ID' },
  { align: 'center', title: '姓名', key: 'Name' },
  { align: 'center', title: '教育類型', key: 'Education_type' },
  { align: 'center', title: '已完成', key: 'Complete' },
]

// 欄位限制
const ruleYear = [
  (v) => v && v.length == 4 || '年份長度必須為4碼',
]
const ruleStudentID = [
  (v) => v && v.length == 9 || '學號長度必須為9碼',
]
const ruleNotBlank = [
  (v) => v && !!v.trim() || '欄位不可為空',
]
const ruleNotSelect = [
  (v) => !!v || '必須選擇其中一項',
]

onMounted(() => {
  yearSelectDialog.value = true;
})

const newStudentSubmit = () => {
  api.post(
    '/manage/query',
    newStudentFormData.value
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status && res.data.msg == 'Done') {
          notifyMessage.value = '學生新增成功！';
          operationNotify.value = true;
          yearSelectSubmit();
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  })
  newStudentForm.value.reset();
  newStudentDialog.value = false;
}
const yearSelectSubmit = () => {
  api.get(
    `/manage/query?${yearSelectFormData.value.type === "0" ? "mode=whole" : "year=" + yearSelectFormData.value.year }`
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          tableData.value = res.data.data;
        }
        break;
      default:
        console.log("Something went wrong...")
        console.log(res);
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
  yearSelectDialog.value = false;
}
const yearFieldCheck = () => {
  yearFieldDisable.value = yearSelectFormData.value.type === "0";
}
const tableDataWithType = computed(() => {
  return tableData.value.filter((data) => {
    if(preferEduType.value == "all") {
      return true;
    }
    return data.Education_type == preferEduType.value;
  });
});
const tableClickOnRow = (event, { item }) => {
  let studentId = item.columns.ID;
  api.get(
    `/manage/query/${studentId}`
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          showStudentInfoDialog(item.columns, res.data.data);
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
}
const showStudentInfoDialog = (row, data) => {
  studentInfoFormData.value.id = data['ID'];
  studentInfoFormData.value.name = row['Name'];
  studentInfoFormData.value.sex = data['Sex'];
  studentInfoFormData.value.eduType = data['Education_type'];
  studentInfoFormData.value.schoolMail = data['School_Email'];
  studentInfoFormData.value.otherMail = data['Email'];
  studentInfoFormData.value.fbid = data['Facebook_Email'];
  studentInfoFormData.value.phone = data['Phone'];
  studentInfoFormData.value.address = data['Address'];
  studentInfoFormData.value.teacher = data['Teacher'];
  studentInfoFormData.value.status = data['Status'];
  if(data['Status_detail'] !== null && data['Status_detail'].includes('|')) {
    studentStatusDetail.value.detailOne = data['Status_detail'].split('|')[0];
    studentStatusDetail.value.detailTwo = data['Status_detail'].split('|')[1];
  } else {
    studentStatusDetail.value.detailOne = data['Status_detail'];
    studentStatusDetail.value.detailTwo = '';
  }
  studentInfoFormData.value.year = data['Year'];
  studentInfoFormData.value.complete = data['Complete'];
  studentInfoDialog.value = true;
}
const deleteStudentInfo = () => {
  let studentId = studentInfoFormData.value.id;
  api.delete(
    `/manage/query/${studentId}`
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          notifyMessage.value = '學生刪除成功！';
          operationNotify.value = true;
          yearSelectSubmit();
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
  studentInfoForm.value.reset();
  infoDeleteDialog.value = false;
  studentInfoDialog.value = false;
}
const saveStudentInfo = () => {
  let studentId = studentInfoFormData.value.id;
  studentInfoFormData.value.statusDetail = `${studentStatusDetail.value.detailOne}|${studentStatusDetail.value.detailTwo}`;

  api.patch(
    `/manage/query/${studentId}`,
    studentInfoFormData.value
  ).then((res) => {
    console.log(res);
    switch(res.status) {
      case 200:
        if(res.data.status && res.data.msg == 'Done') {
          studentInfoDialog.value = false;
          notifyMessage.value = '學生修改成功！';
          operationNotify.value = true;
          yearSelectSubmit();
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
}

const apiErrorHandling = (err) => {
  let res = err.response;
  switch(res.status) {
    case 401:
      if(res.data.msg == "NeedLogin") {
        router.push({ name: 'home' });
      }
      break;
  }
}
</script>

<style scoped>
</style>
