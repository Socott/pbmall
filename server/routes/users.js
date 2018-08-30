var express = require('express');
var router = express.Router();
var Users = require('./../models/users');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('respond with a test');
});

/* POST users ...*/
router.post('/login',(req,res,next)=>{
  let userName = req.body.userName;//用户名
  let userPwd = req.body.userPwd;//密码
  Users.findOne({userName,userPwd},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      if(!doc){
        res.json({
          status:'1',
          msg:''
        });return;
      }
      //写入cookie
      res.cookie('userId',doc.userId,{
        path:'/',
        maxAge:1000*60*60
      });
      res.cookie('userName',doc.userName,{
        path:'/',
        maxAge:1000*60*60
      });
      //写入session
      //req.session.userId = doc.userId;
      res.json({
        status:'0',
        msg:'',
        result:{
          userName:doc.userName
        }
      });
    }
  })
});

//登出
router.post("/logout",(req,res,next)=> {
  res.cookie("userId","",{
    path:"/",
    maxAge:0
  });
  res.cookie("userName","",{
    path:"/",
    maxAge:0
  });
  //req.session.userId = "";
  res.json({
    status:0,
    msg:'',
    result:''
  });
})

//检验是否已经登录
router.get('/checkLogin',(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    });
  }else{
    res.json({
      status:'1',
      msg:'',
      result:''
    });
  }
});

//查询当前用户信息
router.get("/cartList",(req,res,next)=>{
var userId = req.cookies.userId;
  Users.findOne({userId},(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message
          });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          doc:doc
        }
      })

    }
  })
});

//购物车商品删除
router.post("/cart/del",(req,res,next)=>{
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  Users.update({
    userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  });

});

//购物车数量修改
router.post('/cartEdit',(req,res,next)=>{
  let userId = req.cookies.userId,
    productId = req.body.productId,
    checked = req.body.checked?'1':'0',
    productNum = req.body.productNum;
  console.log(userId,productId,productNum,checked);
  Users.update({
    "userId":userId,
    "cartList.productId":productId
  },{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
});

//购物车全选
router.post('/editCheckedAll',(req,res,next)=>{
  let userId = req.cookies.userId,
    checkedAllFlage = req.body.checkedAllFlage?'1':'0';
  console.log(req.body.checkedAllFlage);
  Users.findOne({
    "userId":userId
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      doc.cartList.forEach((product)=>{
        product.checked = checkedAllFlage;
      });
      doc.save((err,doc2)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message
          });
        }else {
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      })
    }
  })
});

module.exports = router;
