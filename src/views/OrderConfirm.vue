<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Order Confirm</span>
    </nav-bread>
  <div class="container">
    <div class="checkout-order">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- process step -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li><span>Make</span> payment</li>
          <li><span>Order</span> confirmation</li>
        </ul>
      </div>

      <!-- order list -->
      <div class="page-title-normal checkout-title">
        <h2><span>Order content</span></h2>
      </div>
      <div class="item-list-wrap confirm-item-list-wrap">
        <div class="cart-item order-item">
          <div class="cart-item-head">
            <ul>
              <li>Order contents</li>
              <li>Price</li>
              <li>Quantity</li>
              <li>Subtotal</li>
            </ul>
          </div>
          <ul class="cart-item-list">
            <li v-for="item in cartList"  v-if="item.checked == '1'">
              <div class="cart-tab-1">
                <div class="cart-item-pic">
                  <img v-lazy="'/static/img/'+item.productImage" :key="'/static/img/'+item.productImage" :alt="item.productName">
                </div>
                <div class="cart-item-title">
                  <div class="item-name">{{item.productName}}</div>

                </div>
              </div>
              <div class="cart-tab-2">
                <div class="item-price">{{item.salePrice | currency('$')}}</div>
              </div>
              <div class="cart-tab-3">
                <div class="item-quantity">
                  <div class="select-self">
                    <div class="select-self-area">
                      <span class="select-ipt">×{{item.productNum}}</span>
                    </div>
                  </div>
                  <div class="item-stock item-stock-no">In Stock</div>
                </div>
              </div>
              <div class="cart-tab-4">
                <div class="item-price-total">{{ (item.salePrice*item.productNum) | currency('$')}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Price count -->
      <div class="price-count-wrap">
        <div class="price-count">
          <ul>
            <li>
              <span>Item subtotal:</span>
              <span>{{subtotal | currency('$')}}</span>
            </li>
            <li>
              <span>Shipping:</span>
              <span>{{shipping | currency('$')}}</span>
            </li>
            <li>
              <span>Discount:</span>
              <span>{{discount | currency('$')}}</span>
            </li>
            <li>
              <span>Tax:</span>
              <span>{{tax | currency('$')}}</span>
            </li>
            <li class="order-total-price">
              <span>Order total:</span>
              <span>{{orderTotal | currency('$')}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="order-foot-wrap">
        <div class="prev-btn-wrap">
          <router-link to="/address" class="btn btn--m">Previous</router-link>
        </div>
        <div class="next-btn-wrap">
          <button class="btn btn--m btn--red" @click="payMent">Proceed to payment</button>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
  </div>
</template>

<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import axios from 'axios'
    export default {
      data(){
        return{
          cartList:[],
          shipping:100,
          discount:200,
          tax:250,
          subtotal:0,
          orderTotal:0
        }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        axios
      },
      mounted:function(){
        this.init();
      },
      methods:{
       init(){
         axios.get('users/cartList').then((res)=>{
           if(res.data.status == '0'){
                this.cartList = res.data.result.doc.cartList;
                this.cartList.forEach((item)=>{
                  if(item.checked == '1'){
                    this.subtotal += parseFloat(item.salePrice) * parseInt(item.productNum);
                  }
                  this.orderTotal = this.subtotal - this.shipping - this.discount + this.tax;
                })
           }
         })
       },
        /**生成订单*/
        payMent(){
          let addressId = this.$route.query.addressId;
          axios.post("/users/payMent",{
            orderTotal:this.orderTotal,
            addressId:addressId
          }).then((response)=>{
            let res = response.data;
            console.log(res.status);
            if(res.status  == '0'){
                this.$router.push({
                  path:'/order/success',
                  query: {
                    orderId:res.result.orderId
                  }
                })
            }else{

            }
          });
        }
      }
    }
</script>

