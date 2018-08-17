<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortup}" @click="sortGoods">Price<svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"><svg id="icon-arrow-short" viewBox="0 0 25 32" width="100%" height="100%"><title>arrow-short</title> <path d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z" class="path1"></path></svg></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == 'all'}"  @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>

              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/img/'+item.productImage" :key="'static/img/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-show="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="load-more">
                  <img src="../assets/loading-spinning-bubbles.svg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
  import './../assets/css/app.css'
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import axios from 'axios'
    export default {
        data(){
          return{
            goodsList:[],
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'100.00'
              },
              {
                startPrice:'100.00',
                endPrice:'500.00'
              },
              {
                startPrice:'500.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'5000.00'
              },
            ],
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false,
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,
            sortup:true,
            loading:true
          }
        },
        name: "GoodsList",
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
      mounted:function () {
        this.getGoodsList();
      },
      methods:{
          getGoodsList(flag){
            /**参数*/
            let param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 : -1,
              priceLevel:this.priceChecked
            };
            axios.get("/goods",{
              params:param
            }).then((res)=>{
              if(res.data.status == '0'){
                if(flag){
                  this.goodsList = this.goodsList.concat(res.data.result.doc);console.log(res.data.result.count);
                  if(res.data.result.count < this.pageSize){
                    this.busy = true;
                    this.loading = false;
                  }else{
                      this.busy = false;
                  }
                }else{
                  this.goodsList = res.data.result.doc;
                    if(res.data.result.count < this.pageSize){
                        this.busy = true;
                        this.loading = false;
                    }else{
                        this.busy = false;
                    }
                }
              }
            });
          },
        showFilterPop(){
            this.filterBy = true;
            this.overLayFlag=true;
        },
        closePop(){
          this.filterBy = false;
          this.overLayFlag=false;
        },
        /**价格过滤*/
        setPriceFilter(index){
            this.page = 1;
            this.priceChecked = index;
            this.overLayFlag=false;
            this.filterBy=false;
            this.getGoodsList();
        },
        /**排序*/
        sortGoods(){
            this.sortFlag = !this.sortFlag;
            this.sortup = !this.sortup;
            this.page = 1;
            this.getGoodsList();
        },
        /**向下滚动时*/
        loadMore(){
          this.busy = true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);
        },
        /**加入购物车*/
          addCart(productId){
              axios.post('/goods/addCart',{productId:productId}).then((res)=>{
                  if(res.data.status == '0'){
                    alert('加入购物车成功！');
                  }else{
                    alert(`msg: ${res.data.msg}`);
                  }
              });
        }
      }
    }
</script>
