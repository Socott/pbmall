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
router.get("/",(req,res,nex)=>{
  let page = req.param('page');
  let pageSize = req.param('pageSize');
  let skip = (page-1)*pageSize

  //获取排序参数
  var sort = req.param('sort');
  let params = {};
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  //查询数据库
  Goods.exec((err,doc)=>{
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
