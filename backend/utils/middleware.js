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
let { body } = require('express-validator');


// 身份驗證 Middleware
function auth(req, res, next) {
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

// 權限有效驗證 Middleware
function permCheck(req, res, next) {
  let checkItems = [];
  checkItems.push(body('pCreate').isInt({ min: 0, max: 1 }));
  checkItems.push(body('pRead').isInt({ min: 0, max: 1 }));
  checkItems.push(body('pUpdate').isInt({ min: 0, max: 1 }));
  checkItems.push(body('pDelete').isInt({ min: 0, max: 1 }));
  return checkItems;
}

module.exports = {
  auth, admin, dbConn,
  fileUpload, permCheck
}
