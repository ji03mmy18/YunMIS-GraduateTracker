let express = require('express');
let router = express.Router();

let { pwHash, permList, auth, admin } = require('../utils/tool');
let queryRouter = require('./mgmt/query');
let batchRouter = require('./mgmt/batch');
let userRouter = require('./mgmt/user');

// 管理員登入
router.post('/login', async (req, res, next) => {
  let { user, pass } = req.body;
  let conn = await req.dbPool.getConnection();

  try {
    const rows = await conn.query("SELECT * FROM manager WHERE User = ?", [user]);

    // 過濾使用者不存在 | 密碼不正確
    if (rows[0] === undefined || rows[0].Passwd != pwHash(pass)) {
      res.status(404).json({ status: false, msg: 'NotFound|PassIncorrect' });
      return;
    }

    // 儲存管理員資訊與其權限
    req.session.user = user;
    req.session.nick = rows[0].Nick;
    req.session.perm = permList(rows[0].PermCreate, rows[0].PermRead, rows[0].PermUpdate, rows[0].PermDelete);
    req.session.deletable = rows[0].Deletable;
    res.status(200).json({ status: true, msg: 'LoggedIn' });
    return;
  } finally {
    conn.end();
  }
});

// 管理員登出
router.get('/logout', async (req, res, next) => {
  // 將目前的Session設定為無效
  req.session.destroy();
  res.status(200).json({ status: true, msg: "LoggedOut" });
  return;
});

// 註冊 query 路由
router.use('/query', auth, queryRouter);

// 註冊 batch 路由
router.use('/batch', auth, batchRouter);

// 註冊 user 路由
router.use('/user', auth, admin, userRouter);

module.exports = router;
