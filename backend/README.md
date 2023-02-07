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
  - 查詢、修改: query.js
  - 匯入、匯出: batch.js
  - 帳號、權限: user.js

## 管理功能

- [x] 1. 閱覽資料(基於 畢業年、學號、教育類型、是否完成)
- [x] 2. 修改資料(基於 閱覽查詢結果)
- [x] 3. 匯入資料(基於 csv格式，提供模板進行下載)
- [x] 4. 匯出資料(基於 csv格式，以畢業年作過濾條件)
- [x] 5. 帳號管理(可新增能登入管理介面的使用者)
- [x] 6. 權限管理(基於 新增、查詢、更新、刪除進行控制)
- [ ] 7. 真人驗證(以hCaptcha作為驗證，避免機器人影響)
- [ ] 8. 統計數據(依照研發處調查表格為樣板提供統計資料)

## 已知問題

1. 目前閱覽功能有三種模式(全部、含NULL、過濾)，應確認後減少為二種。
