var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var Users = require('../models/users');

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
router.get("/list",(req,res,next)=>{
  //获取参数
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let sort = parseInt(req.query.sort);
  let skip = parseInt((page-1)*pageSize);
  let priceLevel = req.query.priceLevel;
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

//加入购物车
router.post("/addCart",(req,res,next)=>{
  //获取商品参数
  var productId = req.body.productId;
  //假设用户已经登录，且userId=100000077
  var userId = req.cookies.userId;
  //根据id查找出用户信息
  Users.findOne({userId:userId},(err,userDoc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      if(userDoc){
        //根据商品id查出商品信息
        Goods.findOne({productId:productId},(err2,doc)=>{
          if(err2){
            res.json({
              status:'1',
              msg:err2.message
            });
          }else{
            if(doc){
              var flag = true;//判断购物车是否已经有商品
              for(var i =0;i<userDoc.cartList.length;i++){
                if(userDoc.cartList[i].productId == productId){
                  flag = false;
                  userDoc.cartList[i].productNum++;
                }
              }
              if(flag){
                doc._doc.productNum = 1;
                doc._doc.checked = 1;
                userDoc.cartList.push(doc);
              }
                userDoc.save((err3,doc3)=>{
                  if(err3){
                    res.json({
                      status:'1',
                      msg:err2.message
                    });
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result: doc3
                    });
                  }
                })
            }
          }
        })
      }
    }
  })

});

module.exports = router;
