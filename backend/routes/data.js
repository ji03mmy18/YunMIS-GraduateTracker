let express = require('express');
let router = express.Router();

let mariadb = require('mariadb');
let dbPool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let { rmEmpty, rmItem } = require('../utils/tool');
let color = require('../utils/color');

// 接收學號，回傳基本資訊或拒絕填寫
router.get('/', async (req, res, next) => {
  let id = req.query.id;
  let conn = await dbPool.getConnection();

  try {
    const rows = await conn.query("SELECT * FROM graduate WHERE ID = ?", [id]);

    // 過濾未找到學生
    if (rows[0] === undefined) {
      res.status(404).json({ status: false, msg: 'NotFound' });
      return;
    }

    // 過濾已完成填寫
    if (rows[0].Complete == 'Y') {
      res.status(200).json({ status: false, msg: 'Finished' });
      return;
    }

    // 回傳資料
    res.status(200).json({ status: true, user: rmItem(rmEmpty(rows[0]), 'Complete') });
    return;
  } finally {
    conn.end();
  }

});

// 接收內容，進行儲存，會先檢查是否可以儲存
router.post('/', async (req, res, next) => {
  let {
    id, sex, eduType, schoolMail,
    otherMail, fbid, phone, address,
    teacher, status, statusDetail
  } = req.body;
  let conn = await dbPool.getConnection();

  try {
    // 過濾學號未找到或已完成填寫
    const rows = await conn.query("SELECT * FROM graduate WHERE ID = ?", [id]);
    if (rows[0] === undefined || rows[0].Complete == 'Y') {
      console.log(`${color.fgYellow("Warn")}: [${id}] ${rows[0] === undefined ? "not found." : "already finish questionnaire."}`);
      res.status(200).json({ status: false, msg: rows[0] === undefined ? 'NotFound' : 'Finished' });
      return;
    }

    // 寫入資料
    const result = await conn.query(
      "UPDATE graduate SET Sex = ?, Education_type = ?, School_Email = ?, Email = ?, Facebook_Email = ?, Phone = ?, \
      Address = ?, Teacher = ?, Status = ?, Status_detail = ?, Complete = 'Y' WHERE ID = ?",
      [sex, eduType, schoolMail, otherMail, fbid, phone, address, teacher, status, statusDetail, id]
    );
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: "StoreError"});
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: "Done"});
    return;
  } finally {
    conn.end();
  }
})

module.exports = router;
