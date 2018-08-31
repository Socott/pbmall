var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":Number,
            "productImage":String,
            "checked":String,
            "productNum":String,
            "checked":String
        }
    ],
    "addressList":[
      {
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": Number,
        "tel": String,
        "isDefault": Boolean
      }
    ]
});

module.exports = mongoose.model('dumall-user',UserSchema);
