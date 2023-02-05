let express = require('express');
let router = express.Router();

let mariadb = require('mariadb');
let dbPool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let { pwHash, permList, auth, rmItem, queryFilter } = require('../utils/tool');

// 管理員登入
router.post('/login', async (req, res, next) => {
  let { user, pass } = req.body;
  let conn = await dbPool.getConnection();

  try {
    const rows = await conn.query("SELECT * FROM manager WHERE User = ?", [user]);

    // 過濾使用者不存在 | 密碼不正確
    if (rows[0] === undefined || rows[0].Passwd != pwHash(pass)) {
      res.status(404).json({ status: false, msg: 'NotFound|PassIncorrect'});
      return;
    }

    // 儲存管理員資訊與其權限
    req.session.user = user;
    req.session.nick = rows[0].Nick;
    req.session.perm = permList(rows[0].PermCreate, rows[0].PermRead, rows[0].PermUpdate, rows[0].PermDelete);
    res.status(200).json({ status: true, msg: 'LoggedIn'});
    return;
  } finally {
    conn.end();
  }
});

// 管理員登出
router.get('/logout', async (req, res, next) => {
  // 將目前的Session設定為無效
  req.session.destroy();
  res.status(200).json({ status: true, msg: "LoggedOut"});
  return;
});

// 查詢學生資料
router.get('/query', auth, async (req, res, next) => {
  let mode = req.query.mode;
  let { id, year, eduType, complete } = queryFilter(req.query);
  let conn = await dbPool.getConnection();

  try {
    let rows;
    // 三種模式，whole為全部資料，null為教育類型無預設值，最後一種為一般查詢
    if (mode == 'whole') {
      rows = await conn.query("SELECT ID, Name, Complete FROM graduate");
    } else if (mode == 'null') {
      rows = await conn.query("SELECT ID, Name, Complete FROM graduate WHERE Education_type IS NULL");
    } else {
      rows = await conn.query(
        "SELECT ID, Name, Complete FROM graduate WHERE ID LIKE ? AND Year LIKE ? AND Education_type LIKE ? AND Complete LIKE ?",
        [id, year, eduType, complete]
      );
    }

    // 回傳查詢結果
    res.status(200).json({ status: true, data: rows});
    return;
  } finally {
    conn.end();
  }
})

module.exports = router;
