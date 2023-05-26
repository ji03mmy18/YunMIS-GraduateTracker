<template>
  <v-container fluid>
    <div class="d-flex align-center w-100 ma-2 pa-2" style="gap: 4px;">
      <h1 class="font-weight-bold flex-grow-0 ma-0">統計資訊</h1>
      <v-btn
        @click="yearChangeDialog = true"
        class="mx-4 flex-grow-0"
        color="success"
      >切換年份
      </v-btn>
    </div>
    <v-divider></v-divider>
    <v-data-table
      :headers="tableHeader"
      :items="tableData"
    ></v-data-table>
  </v-container>
  <!-- 設定年份對話框 -->
  <v-dialog v-model="yearChangeDialog" width="30%">
    <v-card title="設定年份">
      <v-card-text>
        <v-text-field
            label="請輸入西元年"
            :rules="ruleYear"
            placeholder="例：2020"
            variant="outlined"
            v-model="yearChangeData.year"
          ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          width="40%"
          @click="getStatData"
        >送出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 權限不足通知 -->
  <v-snackbar v-model="permDenied" color="warning" timeout="1500">
    <v-alert
      v-model="permDenied"
      type="warning"
      title="權限不足，無法進行操作！"
    ></v-alert>
  </v-snackbar>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref, inject } from 'vue';

const api = inject('api');
const yearChangeDialog = ref(false);
const yearChangeData = ref({year: new Date().getFullYear().toString()});
const tableData = ref([]);
const tableHeader = [
  { align: 'center', sortable: false, title: '教育類型', key: 'eduType' },
  { align: 'center', sortable: false, title: '升學[男]', key: 'UM' },
  { align: 'center', sortable: false, title: '升學[女]', key: 'UF' },
  { align: 'center', sortable: false, title: '就業[男]', key: 'WM' },
  { align: 'center', sortable: false, title: '就業[女]', key: 'WF' },
  { align: 'center', sortable: false, title: '兵役[男]', key: 'MM' },
  { align: 'center', sortable: false, title: '兵役[女]', key: 'MF' },
  { align: 'center', sortable: false, title: '留學[男]', key: 'IM' },
  { align: 'center', sortable: false, title: '留學[女]', key: 'IF' },
  { align: 'center', sortable: false, title: '其他[男]', key: 'OM' },
  { align: 'center', sortable: false, title: '其他[女]', key: 'OF' },
  { align: 'center', sortable: false, title: '總計[男]', key: 'TM' },
  { align: 'center', sortable: false, title: '總計[女]', key: 'TF' },
  { align: 'center', sortable: false, title: '學生總數', key: 'total' }
]
const permDenied = ref(false);

// 欄位限制
const ruleYear = [
  (v) => v && v.length == 4 || '年份長度必須為4碼',
]

onMounted(() => {
  yearChangeDialog.value = true;
})

const getStatData = () => {
  api.get(
    `/manage/stat?year=${yearChangeData.value.year}`
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status) {
          tableData.value = res.data.data;
          yearChangeDialog.value = false;
          yearChangeData.value.year = new Date().getFullYear().toString();
        }
        break;
      default:
        console.log("Something went error...");
        console.log(res);
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
      case 403:
        if(res.data.msg == "PermissionDenied") {
          permDenied.value = true;
        }
        break;
    }
  });
}
</script>

<style scoped>
</style>
