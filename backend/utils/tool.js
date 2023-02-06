let crypto = require('crypto');
let path = require('path');
let multer = require('multer');
let upload = multer({
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    (ext !== '.csv' || mime !== 'text/csv') ?
      cb(new Error("FileTypeMismatch"), false) :
      cb(null, true);
  }
});

// 移除物件中 Value 為 null 的資料
function rmEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

// 移除物件中指定 Key 的資料
function rmItem(obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([k, _]) => k != key));
}

// 密碼雜湊運算式
function pwHash(pass) {
  return crypto.createHmac('sha256', process.env.SALT).update(pass).digest('hex');
}

// 權限陣列轉換
function permList(c, r, u, d) {
  let perm = [];
  c && perm.push('C');
  r && perm.push('R');
  u && perm.push('U');
  d && perm.push('D');
  return perm;
}

// 查詢過濾器，替換掉為 undefined 的查詢內容
function queryFilter(source) {
  let { id, year, eduType, complete } = source;
  id === undefined ? id = '%' : id = `%${id}%`;
  if (year === undefined) year = '%';
  if (eduType === undefined) eduType = '%';
  if (complete === undefined) complete = '%';
  return { id, year, eduType, complete };
}

// 匯出過濾器，替換掉空白年份及布林轉換
function exportFilter(source) {
  let { year, header } = source;
  if (year === undefined || year == '') year = '%';
  header = (header === 'true');
  return { year, header };
}

// 身份驗證 Middleware
function auth(req, res, next) {
  console.log(req.sessionID);
  console.log(req.session);
  return req.session.user ? next() : res.status(401).json({ status: false, msg: "NeedLogin" });
}

// 進階管理員驗證 Middleware
function admin(req, res, next) {
  return req.session.deletable ? res.status(403).json({ status: false, msg: "NotAdvanceManager" }) : next();
}

// 資料庫注入 Middleware
function dbConn(dbPool) {
  return (req, res, next) => {
    req.dbPool = dbPool;
    next();
  }
}

// 檔案上傳 Middleware
function fileUpload(req, res, next) {
  const file = upload.single('studentList');
  file(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(415).json({ status: false, msg: err.message });
      return;
    } else if (err) {
      res.status(415).json({ status: false, msg: err });
      return;
    }
    next();
    return;
  });
}

module.exports = {
  rmEmpty, rmItem, pwHash, permList,
  queryFilter, exportFilter,
  auth, admin, dbConn, fileUpload
};
