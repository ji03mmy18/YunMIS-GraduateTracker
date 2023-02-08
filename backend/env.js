let Color = require('./misc/color');

function envCheck() {
  const {
    DB_HOST, DB_USER, DB_PASS, DB_NAME,
    SESS_SECRET, SALT,
    HCAP_ENABLE,  HCAP_SECRET
  } = process.env;

  validCheck(DB_HOST, 'DB_HOST');
  validCheck(DB_USER, 'DB_USER');
  validCheck(DB_PASS, 'DB_PASS');
  validCheck(DB_NAME, 'DB_NAME');
  validCheck(SALT, 'SALT');
  validCheck(SESS_SECRET, 'SESS_SECRET');
  validCheck(HCAP_ENABLE, 'HCAP_ENABLE');
  validCheck(HCAP_SECRET, 'HCAP_SECRET');
}

function validCheck(variable, name) {
  if (variable === undefined || variable == '') {
    console.log(`${Color.fgRed("envError")}: [${name}] variable not given!`);
    console.log(`${Color.fgGreen("sysInfo")}: System stop... zzz...`);
    process.exit(1);
  } else {
    console.log(`${Color.fgGreen("envInfo")}: [${name}] variable is ok.`);
  }
}

module.exports = envCheck;
