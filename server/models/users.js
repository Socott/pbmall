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
    "addressList":Array
});

module.exports = mongoose.model('dumall-user',UserSchema);
