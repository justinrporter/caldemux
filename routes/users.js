var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/caldemux/*/*', function(req, res, next) {
  console.log(req.baseUrl)
  res.send('respond with a resource');
});

module.exports = router;
