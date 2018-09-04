let express = require('express');
let router = express.Router();
let Users = require('./../models/users');
let util = require('./../util/util');

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
    res.cookie('userName',req.cookies.userName,{
      path:'/',
      maxAge:1000*60*60
    });
    res.cookie('userId',req.cookies.userId,{
      path:'/',
      maxAge:1000*60*60
    });
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

//查询地址
router.get('/adressList',(req,res,next)=>{
  let userId = req.cookies.userId;
  Users.findOne({userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      doc.addressList = doc.addressList.sort(doc.addressList.isDefault )
      res.json({
        status:"0",
        msg:'',
        result:doc.addressList
      })

    }
  })
});

//设置默认地址
router.post('/setDefault',(req,res,next)=>{
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
    Users.findOne({
      userId:userId
    },(err,doc)=>{
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else{
        doc.addressList.forEach((item)=>{
          if(item.addressId == addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });
        doc.save((err1,doc1)=>{
          if(err){
            res.json({
              status:"1",
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:"0",
              msg:'',
              result:doc.addressList
            })
          }
        });
      }
    })
});

//删除地址功能
router.post("/address/del",(req,res,next)=>{
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  Users.update({
    userId:userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'suc',
        result:''
      })
    }
  })

});

//添加地址功能
router.post("/address/add",(req,res,next)=>{
  let userId = req.cookies.userId,
      addressDoc = {};
      userName = req.body.params.userName,
      streetName = req.body.params.streetName,
      postCode = parseInt(req.body.params.postCode),
      tel = req.body.params.tel;
      Users.findOne({
        userId:userId
      },(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          addressDoc={
            userName:userName,
            streetName:streetName,
            postCode:postCode,
            tel:tel,
            isDefault:false
          };
          console.log(addressDoc);
          doc.addressList.push(addressDoc);
          doc.save((err2,doc2)=>{
            if(err2){
              res.json({
                status:'1',
                msg:err2.message,
                result:''
              })
            }else{
              console.log(doc2);
              res.json({
                status:'0',
                msg:'suc',
                result:doc.addressList
              })
            }
          })
        }
      });
});

//生成用户订单
router.post("/payMent",(req,res,next)=>{
  let userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  Users.findOne({
    userId:userId
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let address = '',goodsList = [];
      doc.addressList.forEach((item)=>{
        //获取当前用户地址信息
          if(item.addressId == addressId){
            address = item;
          }
      });
      //获取用户购物车商品
      doc.cartList.filter((item)=>{
        if(item.checked == '1'){
          goodsList = item;
          doc.cartList.remove(item);
        }
      });

      //随机数
      let platform = '622';//平台号
      let r1 = Math.floor(Math.random()*10);//0~10随机数
      let r2 = Math.floor(Math.random()*10);//0~10随机数

      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      let orderId = platform+r1+sysDate+r2;
      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      }

      doc.orderList.push(order);
      doc.save((err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      });
    }
  })
});

//查询订单详情
router.post('/orderDetail',(req,res,next)=>{
  let userId = req.cookies.userId,
    orderId = req.body.orderId;
  Users.findOne({
    userId:userId
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let orderDetail = '';
      doc.orderList.forEach((item)=>{
        if(item.orderId == orderId){
          orderDetail = item;
        }
      })
      if(orderDetail){
        res.json({
          status:'0',
          msg:'',
          result:orderDetail
        })
      }

    }
  })
});

module.exports = router;
