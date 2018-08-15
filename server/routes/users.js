var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('respond with a test');
});

router.post('/addCart', function(req, res, next) {
  /*获取参数*/
  let productId = req.body.param('param');
  console.log(productId);
});

module.exports = router;
