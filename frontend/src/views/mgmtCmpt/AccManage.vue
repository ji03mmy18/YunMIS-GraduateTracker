<template>
  <v-container fluid>
    <div class="d-flex align-center w-100 ma-2 pa-2" style="gap: 4px;">
      <h1 class="font-weight-bold flex-grow-0 ma-0">帳號操作</h1>
      <v-btn
      @click="newSuperManagerDialog = true"
      class="mx-4 flex-grow-0"
      color="warning"
      >新增超級管理員
      </v-btn>
      <v-btn
        @click="newManagerDialog = true"
        class="mx-4 flex-grow-0"
        color="success"
      >新增普通管理員
      </v-btn>
    </div>
    <v-divider></v-divider>
    <v-data-table
      :headers="tableHeader"
      :items="tableData"
      @click:row="tableClickOnRow"
    >
      <template v-slot:item.Deletable="{ item }">
        <v-checkbox-btn
          v-model="item.columns.Deletable"
          :disabled="true"
          class="justify-center"
        ></v-checkbox-btn>
      </template>
    </v-data-table>
  </v-container>
    <!-- 修改紀錄對話框 -->
  <v-dialog width="40%" v-model="modifyManagerDialog">
    <v-form @submit.prevent>
      <v-card title="修改管理員">
        <v-card-text>
          <v-text-field
            v-model="modifyManagerData.user"
            label="帳號"
            variant="outlined"
            :rules="ruleNotBlank"
            :disabled="true"
          ></v-text-field>
          <v-text-field
            v-model="modifyManagerData.nick"
            label="顯示名稱"
            variant="outlined"
            :rules="ruleNotBlank"
          ></v-text-field>
          <v-text-field
            v-model="modifyManagerData.pass"
            label="密碼"
            placeholder="可輸入新密碼進行替換，或留白維持現有密碼"
            variant="outlined"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? '$mdi-eye' : '$mdi-eye-off'"
            @click:append="showPass = !showPass"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            width="30%"
            color="info"
            variant="outlined"
            @click="modifyManagerDialog = false"
          >關閉
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            color="error"
            variant="outlined"
            :disabled="modifyManagerData.deletable"
            @click="deleteManager"
          >刪除
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            width="30%"
            color="success"
            variant="outlined"
            @click="saveManager"
          >儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <!-- 新增超級管理員 -->
  <v-dialog width="40%" v-model="newSuperManagerDialog" scrollable>
    <v-form v-model="newSuperManagerValid" @submit.prevent="submitNewSuperManager">
      <v-card title="新增超級管理員">
        <v-card-text>
          <v-card title="注意！" variant="outlined" color="warning" class="mb-4">
            <v-card-text>
              <p>超級管理員將具有完整權限，且不可透過網頁移除，超級管理員通常為系所承辦人員，若新增的帳號預計給工讀生使用，請新增普通管理員！</p>
            </v-card-text>
          </v-card>
          <v-text-field
            v-model="newSuperManagerData.user"
            label="請輸入帳號"
            variant="outlined"
            :rules="ruleNotBlank"
          ></v-text-field>
          <v-text-field
            v-model="newSuperManagerData.nick"
            label="請輸入顯示名稱"
            variant="outlined"
            :rules="ruleNotBlank"
          ></v-text-field>
          <v-text-field
            v-model="newSuperManagerData.pass"
            label="請輸入密碼"
            variant="outlined"
            :rules="ruleNotBlank"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? '$mdi-eye' : '$mdi-eye-off'"
            @click:append="showPass = !showPass"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="() => {resetFormData(); newSuperManagerDialog = false;}"
            width="40%"
            color="info"
            variant="outlined"
          >取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            width="40%"
            color="warning"
            variant="outlined"
            :disabled="!newSuperManagerValid"
          >儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <!-- 新增普通管理員 -->
  <v-dialog width="40%" v-model="newManagerDialog">
    <v-form v-model="newManagerFormValid" @submit.prevent="submitNewManager">
      <v-card title="新增普通管理員">
        <v-card-text>
          <v-text-field
            v-model="newManagerData.user"
            label="請輸入帳號"
            variant="outlined"
            :rules="ruleNotBlank"
            required
          ></v-text-field>
          <v-text-field
            v-model="newManagerData.nick"
            label="請輸入顯示名稱"
            variant="outlined"
            :rules="ruleNotBlank"
            required
          ></v-text-field>
          <v-text-field
            v-model="newManagerData.pass"
            label="請輸入密碼"
            variant="outlined"
            :rules="ruleNotBlank"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? '$mdi-eye' : '$mdi-eye-off'"
            @click:append="showPass = !showPass"
            required
          ></v-text-field>
          <v-row no-gutters>
            <v-col class="mr-2">
              <v-select
                v-model="newManagerData.pCreate"
                label="請選擇建立權限"
                variant="outlined"
                :rules="ruleNotBlank"
                :items="selectItems"
                item-title="option"
                item-value="value"
                required
              ></v-select>
            </v-col>
            <v-col class="ml-2">
              <v-select
                v-model="newManagerData.pRead"
                label="請選擇讀取權限"
                variant="outlined"
                :rules="ruleNotBlank"
                :items="selectItems"
                item-title="option"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="mr-2">
              <v-select
                v-model="newManagerData.pUpdate"
                label="請選擇更新權限"
                variant="outlined"
                :rules="ruleNotBlank"
                :items="selectItems"
                item-title="option"
                item-value="value"
                required
              ></v-select>
            </v-col>
            <v-col class="ml-2">
              <v-select
                v-model="newManagerData.pDelete"
                label="請選擇刪除權限"
                variant="outlined"
                :rules="ruleNotBlank"
                :items="selectItems"
                item-title="option"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="() => {resetFormData(); newManagerDialog = false;}"
            width="40%"
            color="info"
            variant="outlined"
          >取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            width="40%"
            color="success"
            variant="outlined"
            :disabled="!newManagerFormValid"
          >儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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
import { ref, inject } from 'vue';
import { onMounted } from 'vue';
import router from '@/router';

const api = inject('api');
const modifyManagerDialog = ref(false);
const modifyManagerData = ref({
  user: '',
  pass: '',
  nick: '',
  deletable: true
});
const newSuperManagerDialog = ref(false);
const newSuperManagerValid = ref(false);
const newSuperManagerData = ref({
  user: '',
  pass: '',
  nick: ''
});
const newManagerDialog = ref(false);
const newManagerFormValid = ref(false);
const newManagerData = ref({
  user: '',
  pass: '',
  nick: '',
  pCreate: '',
  pRead: '',
  pUpdate: '',
  pDelete: ''
});
const tableData = ref([]);
const tableHeader = [
  { align: 'center', sortable: false, title: '帳號', key: 'User' },
  { align: 'center', sortable: false, title: '顯示名稱', key: 'Nick' },
  { align: 'center', sortable: false, title: '超級管理員', key: 'Deletable' },
];
const showPass = ref(false);
const selectItems = [
  { option: '是', value: '1' },
  { option: '否', value: '0' }
]
const operationNotify = ref(false);
const notifyMessage = ref('');

// 欄位限制
const ruleNotBlank = [
  (v) => v && !!v.trim() || '欄位不可為空',
]

onMounted(() => {
  getTableData();
});

const getTableData = () => {
  api.get(
    '/manage/user/list'
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          tableData.value = dataPreProcess(res.data.data);
        }
        break;
      default:
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
}
const dataPreProcess = (data) => {
  let transfered = [];
  data.forEach((d) => {
    transfered.push({
      User: d.User,
      Nick: d.Nick,
      Deletable: d.Deletable == 0 ? true : false
    });
  });
  return transfered;
}
const tableClickOnRow = (event, { item }) => {
  modifyManagerData.value.user = item.columns.User;
  modifyManagerData.value.nick = item.columns.Nick;
  modifyManagerData.value.deletable = item.raw.Deletable;
  modifyManagerDialog.value = true;
}
const resetFormData = () => {
  newManagerData.value = {
    user: '',
    pass: '',
    nick: '',
    pCreate: '',
    pRead: '',
    pUpdate: '',
    pDelete: ''
  };
  newSuperManagerData.value = {
    user: '',
    pass: '',
    nick: ''
  };
}
const submitNewManager = () => {
  api.post(
    '/manage/user/new',
    newManagerData.value
  ).then((res) => {
    switch(res.status) {
      case 200:
        newManagerDialog.value = false;
        notifyMessage.value = '普通管理員新增成功！';
        operationNotify.value = true;
        resetFormData();
        getTableData();
        break;
      default:
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  });
}
const submitNewSuperManager = () => {
  api.post(
    '/manage/user/snew',
    newSuperManagerData.value
  ).then((res) => {
    switch(res.status) {
      case 200:
        newSuperManagerDialog.value = false;
        notifyMessage.value = '超級管理員新增成功！';
        operationNotify.value = true;
        resetFormData();
        getTableData();
        break;
      default:
        break;
    }
  }).catch(apiErrorHandling);
}
const deleteManager = () => {
  api.delete(
    `/manage/user/${modifyManagerData.value.user}`
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status && res.data.msg == 'Done') {
          modifyManagerDialog.value = false;
          getTableData();
          notifyMessage.value = `${modifyManagerData.value.user} 刪除成功！`;
          operationNotify.value = true;
        }
        break;
      default:
        console.log("Something went wrong...");
        console.log(res);
        break;
    }
  }).catch(apiErrorHandling);
}
const saveManager = () => {
  api.patch(
    `/manage/user/${modifyManagerData.value.user}`,
    modifyManagerData.value
  ).then((res) => {
    switch(res.status) {
      case 200:
        modifyManagerDialog.value = false;
        getTableData();
        notifyMessage.value = `${modifyManagerData.value.user} 修改成功！`;
        operationNotify.value = true;
        break;
      default:
        break;
    }
  }).catch(apiErrorHandling);
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
