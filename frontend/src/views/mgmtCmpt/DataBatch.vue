<template>
  <v-container fluid class="fill-height align-start">
    <!-- 標題區塊 -->
    <div class="d-flex align-center w-100 ma-2 pa-2">
      <h1 class="font-weight-bold flex-grow-0 ma-0">批次操作</h1>
    </div>
    <v-divider></v-divider>
    <!-- 操作區塊 -->
    <v-container fluid class="d-flex w-100 pa-0" style="height: 90%;">
      <!-- 左側：匯入 -->
      <div style="width: 50%">
        <v-card title="資料匯入" class="pa-2 ma-4" elevation="4">
          <v-card-text>
            <v-card title="使用說明" variant="outlined" class="ma-4" style="text-align: start;">
              <v-card-text>
                <p>資料匯入功能在使用上並不複雜，請先下載範例檔案，該檔案是個副檔名為CSV的文件，可以使用任何你喜歡的編輯工具(e.g., Notepad++, VSCode)開啟！</p>
                <br>
                <p>當開啟後，可以注意到第一行的標題『ID, Name, eduType, Year』，不需要將其刪除，請直接換行後開始填寫，細節可參考範例檔中的範例資料。</p>
                <br>
                <p style="color: red;">請記得在匯入前將範例的三行資料移除，僅保留標題列跟要新增的內容！</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="info"
                  variant="tonal"
                  :href="exampleCSV"
                  download
                >下載範例檔
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-form class="d-flex mt-6" style="gap: 8px" @submit.prevent="batchUploadSubmit">
              <v-file-input
                label="畢業生列表檔案"
                density="compact"
                variant="outlined"
                accept=".csv"
                show-size
                v-model="batchUploadFormData.studentList"
              >
              <template v-slot:append>
                <v-btn type="submit" color="success">上傳</v-btn>
              </template>
              </v-file-input>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
      <v-divider vertical></v-divider>
      <!-- 右側：匯出 -->
      <div style="width: 50%;">
        <v-card title="資料匯出" class="pa-2 ma-4" elevation="4">
          <v-card-text>
            <v-card title="使用說明" variant="outlined" class="ma-4" style="text-align: start;">
              <v-card-text>
                <p>資料匯出功能同樣非常簡單，先決定是否包含標題，接著選擇要匯出的範圍即可下載資料！</p>
              </v-card-text>
            </v-card>
            <v-form @submit.prevent="yearSelectSubmit">
              <v-card variant="flat">
                <v-card-text>
                  <v-checkbox
                    label="包含標題？"
                    color="success"
                    v-model="yearSelectFormData.header"
                  ></v-checkbox>
                  <v-radio-group v-model="yearSelectFormData.type">
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
                  <div class="d-flex" style="gap: 8px;">
                    <v-text-field
                      label="請輸入西元年"
                      :rules="ruleYear"
                      placeholder="例：2020"
                      variant="outlined"
                      density="compact"
                      v-model="yearSelectFormData.year"
                    >
                      <template v-slot:append>
                        <v-btn
                          type="submit"
                          color="success"
                        >下載
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </v-container>
  <v-dialog width="40%" v-model="uploadSuccessDialog">
    <v-card title="匯入結果">
      <v-card-text>
        <v-col>
          <v-row>
            <v-sheet>
              已新增： {{ uploadSuccessInfo.new }} 筆紀錄
            </v-sheet>
          </v-row>
          <v-row>
            <v-sheet>
              已更新： {{ uploadSuccessInfo.update }} 筆紀錄
            </v-sheet>
          </v-row>
          <v-row>
            <v-sheet>
              未更動： {{ uploadSuccessInfo.keep }} 筆紀錄
            </v-sheet>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn
          width="100%"
          variant="outlined"
          color="success"
          @click="uploadSuccessDialog = false"
        >關閉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="operationNotify" color="success" timeout="1500">
    <v-alert
      v-model="operationNotify"
      type="success"
      :title="notifyMessage"
    ></v-alert>
  </v-snackbar>
</template>

<script setup>
import FormData from 'form-data';
import { ref, inject } from 'vue';

const api = inject('api');
const exampleCSV = new URL(
  '@/assets/example.csv',
  import.meta.url
).href;
const batchUploadFormData = ref({
  studentList: null,
});
const yearSelectFormData = ref({
  type: '0',
  year: new Date().getFullYear().toString(),
  header: false
});
const uploadSuccessDialog = ref(false);
const uploadSuccessInfo = ref({
  new: 0,
  update: 0,
  keep: 0,
});
const operationNotify = ref(false);
const notifyMessage = ref('');

const ruleYear = [
  (v) => v && v.length == 4 || '年份長度必須為4碼',
]

const batchUploadSubmit = () => {
  let form = new FormData();
  for (let l of batchUploadFormData.value.studentList) {
    form.append('studentList', l);
  }

  api.post(
    '/manage/batch/import',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' }}
  ).then((res) => {
    switch(res.status) {
      case 200:
        if(res.data.status && res.data.msg == 'UploadDone') {
          uploadSuccessInfo.value.new = res.data.new.length;
          uploadSuccessInfo.value.update = res.data.update.length;
          uploadSuccessInfo.value.keep = res.data.keep.length;
          uploadSuccessDialog.value = true;
        }
        break;
      default:
        break;
    }
  }).catch((err) => {
    apiErrorHandling(err);
  })
}
const yearSelectSubmit = () => {
  window.open(encodeURI(`/api/manage/batch/export?year=${yearSelectFormData.value.type !== "0" ? yearSelectFormData.value.year : ''}&header=${yearSelectFormData.value.header}`));
  notifyMessage.value = '資料匯出成功！';
  operationNotify.value = true;
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
