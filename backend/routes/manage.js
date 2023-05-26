let express = require('express');
let router = express.Router();

let { pwHash, permList, convStatus, convSex } = require('../misc/tool');
let { auth, admin, Captcha, permCheck } = require('../misc/middleware');
let queryRouter = require('./mgmt/query');
let batchRouter = require('./mgmt/batch');
let userRouter = require('./mgmt/user');

// 管理員登入
router.post('/login', Captcha, async (req, res, next) => {
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
    req.session.save();
    res.status(200).json({ status: true, msg: 'LoggedIn', user: { user: user, nick: rows[0].Nick, deletable: rows[0].Deletable } });
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

// 學生統計資料
router.get('/stat', auth, permCheck('R'), async(req, res, next) => {
  const { year } = req.query;
  let conn = await req.dbPool.getConnection();

  try {

    let data = [];

    for(const type of ['四技', '二技', '碩士', '博士', '碩士在職專班', '香港二技專班', '數位碩士在職專班', '其他']) {
      let content = {eduType: type, UM: 0, UF: 0, WM: 0, WF: 0, MM: 0, MF: 0, IM: 0, IF: 0, OM: 0, OF: 0,TM: 0, TF: 0, total: 0};
      let rows = await conn.query(
        "SELECT Status, Sex, COUNT(*) AS Count FROM graduate \
        WHERE Education_type = ? AND Year = ? GROUP BY Status, Sex",
        [type, year]
      );
      rows.forEach((r) => {
        if(r['Status'] == null && r['Sex'] == null) {
          content.total += Number(r['Count']);
        } else {
          content.total += Number(r['Count']);
          content[`T${convSex(r['Sex'])}`] += Number(r['Count']);
          content[`${convStatus(r['Status'])}${convSex(r['Sex'])}`] = Number(r['Count']);
        }
      });
      data.push(content);
    }

    res.status(200).json({ status: true, data: data });
    return;
  } finally {
    conn.end();
  }
});

// 註冊 query 路由
router.use('/query', auth, queryRouter);

// 註冊 batch 路由
router.use('/batch', auth, batchRouter);

// 註冊 user 路由
router.use('/user', auth, admin, userRouter);

module.exports = router;
