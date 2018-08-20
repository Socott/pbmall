<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>My Cart</span>
      </nav-bread>
      <div class="container">
        <div class="cart">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>My Cart</span></h2>
          </div>
          <div class="item-list-wrap">
            <div class="cart-item">
              <div class="cart-item-head">
                <ul>
                  <li>Items</li>
                  <li>Price</li>
                  <li>Quantity</li>
                  <li>Subtotal</li>
                  <li>Edit</li>
                </ul>
              </div>
              <ul class="cart-item-list">
                <li v-for="item in cartList">
                  <div class="cart-tab-1">
                    <div class="cart-item-check">
                      <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
                        <svg class="icon icon-ok">
                          <use xlink:href="#icon-ok"></use>
                        </svg>
                      </a>
                    </div>
                    <div class="cart-item-pic">
                      <img v-lazy="'static/img/'+item.productImage" :key="'static/img/'+item.productImage" v-bind:alt="item.productName">
                    </div>
                    <div class="cart-item-title">
                      <div class="item-name">{{item.productName}}</div>
                    </div>
                  </div>
                  <div class="cart-tab-2">
                    <div class="item-price">{{item.salePrice}}</div>
                  </div>
                  <div class="cart-tab-3">
                    <div class="item-quantity">
                      <div class="select-self select-self-open">
                        <div class="select-self-area">
                          <a class="input-sub">-</a>
                          <span class="select-ipt">{{item.productNum}}</span>
                          <a class="input-add">+</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="cart-tab-4">
                    <div class="item-price-total">{{item.salePrice*item.productNum}}</div>
                  </div>
                  <div class="cart-tab-5">
                    <div class="cart-item-opration">
                      <a href="javascript:;" class="item-edit-btn">
                        <svg class="icon icon-del">
                          <use xlink:href="#icon-del"></use>
                        </svg>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="cart-foot-wrap">
            <div class="cart-foot-inner">
              <div class="cart-foot-l">
                <div class="item-all-check">
                  <a href="javascipt:;">
                  <span class="checkbox-btn item-check-btn">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                    <span>Select all</span>
                  </a>
                </div>
              </div>
              <div class="cart-foot-r">
                <div class="item-total">
                  Item total: <span class="total-price">500</span>
                </div>
                <div class="btn-wrap">
                  <a class="btn btn--red">Checkout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <model v-bind:mdShow="mdConfirm">
        <p slot="message">
          您确定要删除此条数据吗?
        </p>
        <div slot="btnGroup" v-bind:mdShow="mdConfirm" v-on:close="closeModel">
          <a class="btn btn--m" href="javascript:(0);" @click="mdConfirm = false">确认</a>
          <a class="btn btn--m" href="javascript:(0);" @click="mdConfirm = false">关闭</a>
        </div>
      </model>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import Model from './../components/Models'
  import axios from 'axios'
    export default {
        name: "Cart",
      data(){
          return {
            cartList:[],
            mdConfirm:true
          }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        Model,
        axios
      },
      mounted:function(){
         this.getCartList();
      },
      methods:{
        getCartList(){
            axios('users/cartList').then((res)=>{
              if(res.data.status == '0'){
                  this.cartList = res.data.result.doc.cartList
              }
            })
        },
        closeModel(){
          this.mdConfirm = false;
        }
      }
    }
</script>

<style scoped>

</style>
