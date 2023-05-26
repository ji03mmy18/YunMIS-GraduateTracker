<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
        <v-card title="使用說明" class="pa-2 ma-4 " elevation="4" width="50%">
          <v-card-text>
            <p>系統功能包含三個區塊，可用於少量資料的操作與修改、大量匯入或匯出、以及統計資料，可在左側的導覽區塊中找到對應功能。</p>
            <br>
            <v-card title="資料管理" variant="outlined" class="ma-4" style="text-align: start;">
              <v-card-text>
                <p>│</p>
                <p>├ 學生查詢：查詢、新增、修改、刪除 單一學生</p>
                <p>├ 批次操作：大量匯入學生、匯出學生</p>
                <p>└ 統計資訊：依據畢業生出路調查表格設計的統計資訊</p>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
</style>
