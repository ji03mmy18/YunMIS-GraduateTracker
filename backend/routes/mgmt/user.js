let express = require('express');
let router = express.Router({mergeParams: true});
let { validationResult } = require('express-validator');

let { pwHash } = require('../../misc/tool');
let { permFieldCheck } = require('../../misc/middleware');

// 取得管理員列表
router.get('/list', async (req, res, next) => {
  let conn = await req.dbPool.getConnection();

  try {
    const rows = await conn.query(
      "SELECT User, Nick, Deletable, PermCreate, PermRead, PermUpdate, PermDelete\
      FROM manager ORDER BY Deletable, User"
    );
    if (rows[0] === undefined)  {
      res.status(404).json({ status: false, msg: 'ManagerNotFound' });
      return;
    }

    // 回傳查詢結果
    res.status(200).json({ status: true, data: rows });
    return;
  } finally {
    conn.end();
  }
});

// 新增管理員
router.post('/new', permFieldCheck(), async (req, res, next) => {
  let {
    user, pass, nick, pCreate,
    pRead, pUpdate, pDelete
  } = req.body;
  let conn = await req.dbPool.getConnection();
  let error = validationResult(req);

  try {
    // 檢查傳入權限是否有效
    if (!error.isEmpty()) {
      res.status(400).json({ status: false, msg: 'PermissionError' });
      return;
    }

    // 新增資料到資料庫中
    const result = await conn.query(
      "INSERT INTO manager(User, Passwd, Nick, Deletable, PermCreate, PermRead, PermUpdate, PermDelete) \
      VALUES (?, ?, ?, '1', ?, ?, ?, ?)", [user, pwHash(pass), nick, pCreate, pRead, pUpdate, pDelete]);
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'ManagerAddFailed'});
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

// 新增超級管理員
router.post('/snew', async (req, res, next) => {
  let { user, pass, nick } = req.body;
  let conn = await req.dbPool.getConnection();

  try {
    // 新增資料到資料庫中
    const result = await conn.query(
      "INSERT INTO manager(User, Passwd, Nick, Deletable, PermCreate, PermRead, PermUpdate, PermDelete) \
      VALUES (?, ?, ?, '0', '1', '1', '1', '1')", [user, pwHash(pass), nick]);
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'ManagerAddFailed'});
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

// 修改管理員資訊
router.patch('/:id', async (req, res, next) => {
  let uid = req.params.id;
  let { user, pass, nick } = req.body;
  let conn = await req.dbPool.getConnection();

  try {
    // 請求檢查
    if (uid != user) {
      res.status(400).json({ status: false, msg: 'AccountMismatch' });
      return;
    }

    // 操作資料庫進行更新
    const result = await conn.query("UPDATE manager SET Passwd = IFNULL(?, Passwd), Nick = ? WHERE User = ?",
      [pass == '' ? null : pwHash(pass), nick, user]
    );
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'ManagerModifyFailed' });
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

// 修改管理員權限
router.patch('/:id/perm', permFieldCheck(), async (req, res, next) => {
  let uid = req.params.id;
  let {
    user, pCreate, pRead, pUpdate, pDelete
  } = req.body;
  let conn = await req.dbPool.getConnection();
  let error = validationResult(req);

  try {
    // 檢查傳入權限是否有效
    if (!error.isEmpty()) {
      res.status(400).json({ status: false, msg: 'PermissionError' });
      return;
    }

    // 請求檢查
    if (uid != user) {
      res.status(400).json({ status: false, msg: 'AccountMismatch' });
      return;
    }

    // 操作資料庫進行更新
    const result = await conn.query("UPDATE manager SET \
      PermCreate = ?, PermRead = ?, PermUpdate = ?, PermDelete = ? WHERE User = ?",
      [pCreate, pRead, pUpdate, pDelete, user]
    );
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'ManagerModifyFailed' });
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

// 刪除管理員
router.delete('/:id', async (req, res, next) => {
  let uid = req.params.id;
  let conn = await req.dbPool.getConnection();

  try {
    // 查詢管理員是否存在
    const rows = await conn.query("SELECT * FROM manager WHERE User = ?", [uid]);
    if (rows[0] === undefined) {
      res.status(404).json({ status: false, msg: 'ManagerNotFound' });
      return;
    }
    // 確認是否可以刪除
    if (rows[0].Deletable == 0) {
      res.status(200).json({ status: false, msg: 'ManagerCannotRemove' });
      return;
    }

    // 實際刪除管理員
    const result = await conn.query("DELETE FROM manager WHERE User = ?", [uid]);
    if (result.affectedRows != 1) {
      res.status(500).json({ status: false, msg: 'ManagerDeleteFailed' });
      return;
    }

    // 回傳結果
    res.status(200).json({ status: true, msg: 'Done' });
    return;
  } finally {
    conn.end();
  }
});

module.exports = router;
