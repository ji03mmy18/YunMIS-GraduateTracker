let express = require('express');
let router = express.Router({mergeParams: true});

let { queryFilter } = require('../../misc/tool');
let { permCheck } = require('../../misc/middleware');
let color = require('../../misc/color');

// 查詢批量學生資料
router.get('', permCheck('R'), async (req, res, next) => {
  let mode = req.query.mode;
  let { id, year, eduType, complete } = queryFilter(req.query);
  let conn = await req.dbPool.getConnection();

  try {
    let rows;
    // 三種模式，whole為全部資料，null為教育類型無預設值，最後一種為一般查詢
    if (mode == 'whole') {
      rows = await conn.query("SELECT ID, Name, Education_type, Complete FROM graduate");
    } else if (mode == 'null') {
      rows = await conn.query("SELECT ID, Name, Education_type, Complete FROM graduate WHERE Education_type IS NULL");
    } else {
      rows = await conn.query(
        "SELECT ID, Name, Education_type, Complete FROM graduate WHERE \
        ID LIKE ? AND Year LIKE ? AND Education_type LIKE ? AND Complete LIKE ?",
        [id, year, eduType, complete]
      );
    }

    // 回傳查詢結果
    res.status(200).json({ status: true, data: rows });
    return;
  } finally {
    conn.end();
  }
});

// 查詢單一學生資料
router.get('/:id', permCheck('R'), async (req, res, next) => {
  let id = req.params.id;
  let conn = await req.dbPool.getConnection();

  try {
    const rows = await conn.query("SELECT * FROM graduate WHERE ID = ?", [id]);

    if (rows[0] === undefined || rows[0].ID != id) {
      res.status(404).json({ status: false, msg: 'NotFound' });
      return;
    }

    // 回傳查詢結果
    res.status(200).json({ status: true, data: rows[0] });
    return;
  } finally {
    conn.end();
  }
});

// 新增單一學生
router.post('', permCheck('C'), async (req, res, next) => {
  let { id, name, eduType, year } = req.body;
  let conn = await req.dbPool.getConnection();

  try {
    // 插入新資料
    let result = await conn.query(
      "INSERT INTO graduate(ID, Name, Education_type, Year) VALUES (?, ?, ?, ?)\
      ON DUPLICATE KEY UPDATE Name=?, Education_type=?, Year=?",
      [id, name, eduType, year, name, eduType, year]
    );
    if (result.affectedRows == 0) {
      res.status(500).json({ status: false, msg: 'CreateError' });
      return;
    }

    res.status(200).json({ status: true,  msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
})

// 修改單一學生資料
router.patch('/:id', permCheck('U'), async (req, res, next) => {
  let id = req.params.id;
  let {
    name, sex, eduType, schoolMail,
    otherMail, fbid, phone, address,
    teacher, status, statusDetail,
    year, complete
  } = req.body;
  let conn = await req.dbPool.getConnection();

  try {
    // 寫入資料
    const result = await conn.query(
      "UPDATE graduate SET Name = ?, Sex = ?, Education_type = ?, School_Email = ?, Email = ?, Facebook_Email = ?, Phone = ?, \
      Address = ?, Teacher = ?, Status = ?, Status_detail = ?, Year = ?, Complete = ? WHERE ID = ?",
      [name, sex, eduType, schoolMail, otherMail, fbid, phone, address, teacher, status, statusDetail, year, complete, id]
    );
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'StoreError' });
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

// 刪除單一學生
router.delete('/:id', permCheck('D'), async(req, res, next) => {
  let id = req.params.id;
  let conn = await req.dbPool.getConnection();

  try {
    // 先查詢資料，並將資料複製一份到 removeGradu 表中
    const row = await conn.query("SELECT * FROM graduate WHERE ID = ?", [id]);
    const insResult = await conn.query("INSERT INTO removeGradu \
      (ID, Name, Sex, Education_type, School_Email, Email, Facebook_Email, Phone, Address, Teacher, Status, \
      Status_detail, Year, Complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(row[0])
    );
    // 檢查插入是否成功
    if (insResult.affectedRows != 1) {
      console.log(`${color.fgRed("Error")}: [${id}] delete failed, cannot insert old record to remove area.`);
      res.status(500).json({ status: false, msg: 'DeleteError' });
      return;
    }
    // 將 graduate 表中的資料移除
    const delResult = await conn.query("DELETE FROM graduate WHERE ID = ?", [id]);
    // 檢查是否成功移除
    if (delResult.affectedRows != 1) {
      console.log(`${color.fgRed("Error")}: [${id}] delete failed, cannot delete old record from graduate.`);
      res.status(500).json({ status: false, msg: 'DeleteError' });
    }

    // 回傳執行結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

module.exports = router;
