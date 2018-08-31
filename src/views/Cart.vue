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
                      <a href="javascript:(0);" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
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
                    <div class="item-price">{{item.salePrice | currency('$')}}</div>
                  </div>
                  <div class="cart-tab-3">
                    <div class="item-quantity">
                      <div class="select-self select-self-open">
                        <div class="select-self-area">
                          <a class="input-sub" @click="editCart('minu',item)">-</a>
                          <span class="select-ipt">{{item.productNum}}</span>
                          <a class="input-add" @click="editCart('add',item)">+</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="cart-tab-4">
                    <div class="item-price-total">{{item.salePrice*item.productNum | currency('$')}}</div>
                  </div>
                  <div class="cart-tab-5">
                    <div class="cart-item-opration">
                      <a href="javascript:;" class="item-edit-btn" @click="delCartConfirm(item.productId)">
                        <svg class="icon icon-del">
                          <use xlink:href="#icon-del">
                            <svg id="icon-del" viewBox="0 0 32 32" width="100%" height="100%"><title>delete</title> <path d="M11.355 4.129v-2.065h9.29v2.065h-9.29zM6.194 29.935v-23.742h19.613v23.742h-19.613zM30.968 4.129h-8.258v-3.097c0-0.569-0.463-1.032-1.032-1.032h-11.355c-0.569 0-1.032 0.463-1.032 1.032v3.097h-8.258c-0.569 0-1.032 0.463-1.032 1.032s0.463 1.032 1.032 1.032h3.097v24.774c0 0.569 0.463 1.032 1.032 1.032h21.677c0.569 0 1.032-0.463 1.032-1.032v-24.774h3.097c0.569 0 1.032-0.463 1.032-1.032s-0.463-1.032-1.032-1.032v0z" class="path1"></path> <path d="M10.323 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path2"></path> <path d="M16 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path3"></path> <path d="M21.677 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z" class="path4"></path></svg>
                          </use>
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
                  <a href="javascript:(0);" @click="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn" v-bind:class="{'check':checkedAllFlage}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                    <span>Select all</span>
                  </a>
                </div>
              </div>
              <div class="cart-foot-r">
                <div class="item-total">
                  Item total: <span class="total-price">{{totalPrice | currency('$')}}</span>
                </div>
                <div class="btn-wrap">
                  <a class="btn btn--red" v-bind:class="{'btn--dis':checkedCount==0}" @click="Checkout">Checkout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <model v-bind:mdShow="mdConfirm" v-on:close="closeModel">
        <p slot="message">
          您确定要删除此条数据吗?
        </p>
        <div slot="btnGroup" >
          <a class="btn btn--m" href="javascript:(0);" @click="delCart()">确认</a>
          <a class="btn btn--m" href="javascript:(0);" @click="mdConfirm = false;productId=''">关闭</a>
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
            productId:'',
            mdConfirm:false,
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
      computed:{
        checkedAllFlage(){
          return this.checkedCount == this.cartList.length;
        },
        checkedCount(){
          var i = 0;
          this.cartList.forEach((item)=>{
            if(item.checked == '1'){
              i++;
            }
          });
          return i;
        },
        totalPrice(){
          var money = 0;
          this.cartList.forEach((item)=>{
            if(item.checked == '1'){
              money += parseFloat(item.salePrice) * parseInt(item.productNum);
            }
          });
          return money;
        }
      },
      methods:{
        getCartList(){
            axios.get('/users/cartList').then((res)=>{
              if(res.data.status == '0'){
                  this.cartList = res.data.result.doc.cartList
              }
            })
        },
        closeModel(){
          this.mdConfirm = false;
        },
        delCart(){
          axios.post('users/cart/del',{
            productId:this.productId
          }).then((res)=>{
              if(res.data.status == '0'){
                this.mdConfirm = false;
                this.getCartList();
              }else {
                this.mdConfirm = false;
                this.getCartList();
              }
          });
        },
        delCartConfirm(productId){
          this.mdConfirm = true;
          this.productId = productId;
        },
        /**编辑数量*/
        editCart(flag,item){
          item.checked = item.checked==1?true:false;
          if(flag == 'add'){
            item.productNum++;
          }else if(flag == 'minu'){
            if(item.productNum <=1 ){
              return;
            }
            item.productNum--;
          }else{console.log(item.checked);
            item.checked  = ! item.checked;
          }
          console.log(item.checked);
          axios.post('users/cartEdit',{
            checked :item.checked,
            productId:item.productId,
            productNum:item.productNum
          }).then((res)=>{
            if(res.data.status == '0'){
            }else{
              alert(res.data.msg);
            }
          });
        },
        /**全选功能*/
        toggleCheckAll(){
          let flag = !this.checkedAllFlage;
          this.cartList.forEach((item)=>{
            item.checked = flag?'1':0;
          });
          axios.post('users/editCheckedAll',{
            checkedAllFlage:flag
          }).then((res)=>{
            if(res.data.status == '0'){
            }else{
              alert(res.data.msg);
            }
          });
        },
        /**跳转到地址页面*/
        Checkout(){
          if(this.checkedCount > 0){
            this.$router.push({
              path:'address'
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
