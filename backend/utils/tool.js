let crypto = require('crypto');

function rmEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

function rmItem(obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([k, _]) => k != key));
}

function pwHash(pass) {
  return crypto.createHmac('sha256', process.env.SALT).update(pass).digest('hex');
}

function permList(c, r, u, d) {
  let perm = [];
  c && perm.push('C');
  r && perm.push('R');
  u && perm.push('U');
  d && perm.push('D');
  return perm;
}

function auth(req, res, next) {
  return req.session.user ? next() : res.status(401).json({ status: false, msg: "NeedLogin"});
}

module.exports = {
  rmEmpty, rmItem, pwHash, permList, auth
};
