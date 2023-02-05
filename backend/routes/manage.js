let express = require('express');
let router = express.Router();

let mariadb = require('mariadb');
let dbPool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let { pwHash, permList, auth } = require('../utils/tool');

// 管理員登入
router.post('/login', async (req, res, next) => {
  let { user, pass } = req.body;
  let conn = await dbPool.getConnection();

  try {
    const rows = conn.query("SELECT * FROM manager WHERE USER = ?", [user]);

    // 過濾使用者不存在 | 密碼不正確
    if (rows[0] === undefined || rows[0].Passwd != pwHash(pass)) {
      res.status(404).json({ status: false, msg: 'NotFound|PassIncorrect'});
      return;
    }

    // 儲存管理員資訊與其權限
    req.session.user = user;
    req.session.nick = rows[0].Nick;
    req.session.perm = permList(rows[0].Create, rows[0].Read, rows[0].Update, rows[0].Delete);
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

module.exports = router;
