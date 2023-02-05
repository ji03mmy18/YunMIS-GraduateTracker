# YunMIS GraduateTracker Backend

## 環境變數

Database Related:
- DB_HOST
- DB_USER
- DB_PASS
- DB_NAME

Session Related:
- SESS_SECRET
- SALT

## 路由設計

- 學生端: data.js
- 管理端: manage.js

## 管理功能

1. 閱覽資料(基於 畢業年、學號、教育類型、是否完成)
2. 修改資料(基於 閱覽查詢結果)
3. 匯入資料(基於 csv格式)
4. 匯出資料(基於 csv格式)
5. 帳號管理(可新增能登入管理介面的使用者)
6. 權限管理(基於 新增、查詢、更新、刪除進行控制)
7. 寄驗證碼(系統於匯入時自動生成，並寄送到學生信箱)
