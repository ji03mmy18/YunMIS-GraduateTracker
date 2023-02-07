let express = require('express');
let router = express.Router({mergeParams: true});
let { parse, stringify } = require('csv');

let { exportFilter } = require('../../misc/tool');
let { fileUpload } = require('../../misc/middleware');
let color = require('../../misc/color');

// 批量學生匯入
router.post('/import', fileUpload, async (req, res, next) => {
  let conn = await req.dbPool.getConnection();
  let keeped = [];
  let updated = [];
  let inserted = [];

  try {
    //透過 csv-parse 將資料轉換成物件
    parse(req.file.buffer, { delimiter: ',', columns: true })
      .on("data", async (row) => {
        // 每送入一筆資料就儲存一次
        let result = await conn.query("INSERT INTO graduate(ID, Name, Education_type, Year)\
          VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE ID = ?, Name = ?, Education_type = ?, Year = ?",
          [row['ID'], row['Name'], row['eduType'], row['Year'],
            row['ID'], row['Name'], row['eduType'], row['Year']]
        );
        // 檢查是否有正確存入
        if (result.affectedRows == 0) {
          keeped.push(row['ID']);
        } else if (result.affectedRows == 1) {
          inserted.push(row['ID']);
        } else if (result.affectedRows == 2) {
          updated.push(row['ID']);
        }
      });

    res.status(200).json({ status: true, msg: 'UploadDone', update: updated, keep: keeped, new: inserted });
    return;
  } finally {
    conn.end();
  }
});

// 下載匯入模板
router.get('/template', async (req, res, next) => {
  // 建立新 csv 物件
  let csv = stringify({
    header: true,
    columns: ['ID', 'Name', 'eduType', 'Year']
  });
  csv.write(['B10X230XX', '範例人員', '四技', '2000']);

  // 設定標頭及回傳下載內容
  res.setHeader('Content-disposition', 'attachment; filename=template.csv');
  res.setHeader('Content-type', 'text/csv');
  csv.end().pipe(res);
  return;
});

// 批量紀錄導出
router.get('/export', async (req, res, next) => {
  let { year, header } = exportFilter(req.query);
  let conn = await req.dbPool.getConnection();

  try {
    // 查詢年度資料
    const rows = await conn.query("SELECT * FROM graduate WHERE Year LIKE ?", [year]);
    if (rows[0] === undefined) {
      res.status(404).json({ status: false, msg: 'ExportYearNotFound' });
      return;
    }

    // 建立 csv 物件，根據 header 決定是否包含標題列
    let csv = stringify({
      header,
      columns: [
        'ID','Name','Sex','Education_type','School_Email',
        'Email','Facebook_Email','Phone','Address','Teacher',
        'Status','Status_detail','Year','Complete'
      ]
    });
    rows.forEach((row) => {
      csv.write(Object.values(row));
    });

    // 設定標頭及回傳下載內容
    res.setHeader('Content-disposition', `attachment; filename=Graduate${year}.csv`);
    res.setHeader('Content-type', 'text/csv');
    csv.end().pipe(res);
    return;
  } finally {
    conn.end();
  }
});

module.exports = router;
