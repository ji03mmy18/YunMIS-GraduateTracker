<template>
  <v-container fluid>
    <div class="d-flex align-center w-100 ma-2 pa-2" style="gap: 4px;">
      <h1 class="font-weight-bold flex-grow-0 ma-0">帳號權限</h1>
      <v-spacer></v-spacer>
      <v-btn
        @click="savePermChange"
        :disabled="saveButtonEn"
        color="success"
      >儲存權限變更</v-btn>
    </div>
    <v-divider></v-divider>
    <v-data-table
      :headers="tableHeader"
      :items="tableData"
    >
      <template v-slot:item.PermCreate="{ item }" >
        <v-checkbox-btn
          v-model="item.raw.PermCreate"
          :disabled="item.raw.Deletable"
          class="justify-center"
        ></v-checkbox-btn>
      </template>
      <template v-slot:item.PermRead="{ item }">
        <v-checkbox-btn
          v-model="item.raw.PermRead"
          :disabled="item.raw.Deletable"
          class="justify-center"
        ></v-checkbox-btn>
      </template>
      <template v-slot:item.PermUpdate="{ item }">
        <v-checkbox-btn
          v-model="item.raw.PermUpdate"
          :disabled="item.raw.Deletable"
          class="justify-center"
        ></v-checkbox-btn>
      </template>
      <template v-slot:item.PermDelete="{ item }">
        <v-checkbox-btn
          v-model="item.raw.PermDelete"
          :disabled="item.raw.Deletable"
          class="justify-center"
        ></v-checkbox-btn>
      </template>
    </v-data-table>
  </v-container>
  <!-- 新增成功通知 -->
  <v-snackbar v-model="operationNotify" :color="notifyColor" timeout="1500">
    <v-alert
      v-model="operationNotify"
      :type="notifyColor"
      :title="notifyMessage"
    ></v-alert>
  </v-snackbar>
</template>

<script setup>
import { watch } from 'vue';
import { reactive } from 'vue';
import { onBeforeMount } from 'vue';
import { ref, inject } from 'vue';
import router from '@/router';

const api = inject('api');
const tableData = reactive([]);
const tableHeader = [
  { align: 'center', sortable: false, title: '帳號', key: 'User' },
  { align: 'center', sortable: false, title: '顯示名稱', key: 'Nick' },
  { align: 'center', sortable: false, title: '新增權限', key: 'PermCreate' },
  { align: 'center', sortable: false, title: '讀取權限', key: 'PermRead' },
  { align: 'center', sortable: false, title: '修改權限', key: 'PermUpdate' },
  { align: 'center', sortable: false, title: '刪除權限', key: 'PermDelete' }
];
const origPermData = reactive([]);
const operationNotify = ref(false);
const notifyColor = ref('success');
const notifyMessage = ref('');
const saveButtonEn = ref(true);
const watchDataLock = ref(false);

watch(tableData, () => {
  if(watchDataLock.value === true) {
    saveButtonEn.value = false;
  }
  watchDataLock.value = true;
});

onBeforeMount(() => {
  getTableData()
});

const getTableData = () => {
  api.get(
    '/manage/user/list'
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          Object.assign(tableData, dataPreProcess(res.data.data));
          Object.assign(origPermData, dataPreProcess(res.data.data));
        }
        break;
      default:
        break;
    }
  }).catch((err) => {
    let res = err.response;
    switch(res.status) {
      case 401:
        if(res.data.msg == "NeedLogin") {
          router.push({ name: 'home' });
        }
        break;
      default:
        console.log(err);
        break;
    }
  });
}
const dataPreProcess = (data) => {
  let transfered = [];
  data.forEach((d) => {
    transfered.push({
      User: d.User,
      Nick: d.Nick,
      Deletable: d.Deletable == 0 ? true : false,
      PermRead: d.PermRead == 1 ? true : false,
      PermCreate: d.PermCreate == 1 ? true : false,
      PermUpdate: d.PermUpdate == 1 ? true : false,
      PermDelete: d.PermDelete == 1 ? true : false
    });
  });
  return transfered;
}
const dataPostProcess = (data) => {
  return {
    user: data.User,
    pCreate: data.PermCreate ? 1 : 0,
    pRead: data.PermRead ? 1 : 0,
    pUpdate: data.PermUpdate ? 1 : 0,
    pDelete: data.PermDelete ? 1 : 0
  };
}
const savePermChange = async () => {
  let changed = [];
  let tLength = origPermData.length;
  let saveResult = true;

  for(let i = 0; i < tLength; i++) {
    if (!shallowEqual(origPermData[i], tableData[i])) {
      changed.push(dataPostProcess(tableData[i]));
    }
  }

  for(let c of changed) {
    try {
      await api.patch(`/manage/user/${c.user}/perm`, c);
    } catch(err) {
      let res = err.response;
      switch(res.status) {
        case 401:
          if(res.data.msg == "NeedLogin") {
            router.push({ name: 'home' });
          }
          break;
        default:
          saveResult = false;
          console.log(err);
          break;
      }
    }
  }

  if(saveResult) {
    notifyColor.value = 'success';
    notifyMessage.value = '權限儲存成功！';
    operationNotify.value = true;
    getTableData();
    watchDataLock.value = false;
    saveButtonEn.value = true;
  } else {
    notifyColor.value = 'error';
    notifyMessage.value = '儲存過程發生錯誤，請聯絡開發者！';
    operationNotify.value = true;
  }
}
const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
</script>

<style scoped>
</style>
