var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

//监听数据库连接
mongoose.connection.on("connected",()=>{
  console.log(`MongoDB connected success.`);
});

mongoose.connection.on("error",()=>{
  console.log(`MongoDB connected error.`);
});

mongoose.connection.on("disconnected",()=>{
  console.log(`MongoDB connected disconnected.`);
});

//查询商品（二级路由）
router.get("/",(req,res,next)=>{
  //获取参数
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let sort = parseInt(req.param('sort'));
  let skip = parseInt((page-1)*pageSize);
  let priceLevel = req.param('priceLevel');
  let priceGt = '',priceLte = '';
  let params = {};
  if(priceLevel != 'all'){
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    };
  console.log(params);
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  //查询数据库
  goodsModel.exec((err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          doc:doc
        }
      });
    }
  })
});

module.exports = router;
