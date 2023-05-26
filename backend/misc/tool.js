let crypto = require('crypto');

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

// 學生狀態轉換
function convStatus(status) {
  switch(status) {
    case '升學':
      return 'U';
    case '就業':
      return 'W';
    case '服兵役':
      return 'M';
    case '留學':
      return 'I';
    case '其他':
      return 'O';
  }
}

// 學生性別轉換
function convSex(sex) {
  switch(sex) {
    case '男':
      return 'M';
    case '女':
      return 'F';
  }
}

module.exports = {
  rmEmpty, rmItem, pwHash, permList,
  queryFilter, exportFilter,
  convStatus, convSex
};
