let express = require('express');
let router = express.Router({mergeParams: true});
let { parse } = require('csv');

const { fileUpload } = require('../../utils/tool');
const color = require('../../utils/color');

// 批量學生匯入
router.post('/import', fileUpload, async (req, res, next) => {
  let conn = await req.dbPool.getConnection();

  try {
    //透過 csv-parse 將資料轉換成物件
    parse(req.file.buffer, { delimiter: ',', columns: true })
      .on("data", (row) => {
        // 每送入一筆資料就儲存一次
        let result = conn.query("INSERT INTO graduate(ID, Name, Education_type, Year) VALUES (?, ?, ?, ?)", [row['ID'], row['Name'], row['eduType'], row['Year']]);
        // 檢查是否有正確存入
        if (result.affectedRows != 1) {
          console.log(`${color.fgRed('Error')}: [${row['ID']}] failed to import.`);
          res.status(500).json({ status: false, msg: "ImportError" });
          return;
        }
      });

    res.status(200).json({ status: true, msg: "UploadDone" });
    return;
  } finally {
    conn.end();
  }
})

// 批量紀錄導出
router.get('/export', async (req, res, next) => {

})

module.exports = router;
