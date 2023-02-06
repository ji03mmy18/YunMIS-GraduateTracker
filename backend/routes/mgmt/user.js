let express = require('express');
let router = express.Router({mergeParams: true});

router.get('/list', async (req, res, next) => {
  res.status(200).json({ status: true, msg: "OK!" });
  return;
})

module.exports = router;
