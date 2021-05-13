<template>
  <div class="home">
    <Tabbar :title="is_send?'发件箱':'收件箱'" :leftArrow="true" />
    <div class="card">
      <div class="content">
        <div v-if="!is_send">发件人:{{item.member}}</div>
        <div>
          <span>{{item.create_time}}</span>
        </div>
      </div>
      <div>
        <div class="button" @click="go('sending')" v-if="!is_send">回复</div>
      </div>
    </div>
    <div class="header">{{item.title}}</div>
    <div class="title" >{{item.content}}</div>
  </div>
</template>

<script>
import Vue from "vue";
import url from "../../assets/js/api.js";
import axios from "axios";
import Tabbar from "@/components/tabbar";
export default {
  components: { Tabbar },
  created() {
    if(this.$route.params.id==0){
       this.is_send=false
    }else{
       this.is_send=true
    }
    console.log();
    this.item=this.$route.params.item
  //   if(this.$route.query.status==0){
  //     this.text=""
  //     this.title="收件箱"
  //     userReceive().then(res=>{
  //     this.arr=res
  //   })
  //   }else{
  //     this.text="发件"
  //     this.title="发件箱"
  //     userSend().then(res=>{
  //     this.arr=res
  //   })   
  //  }  
  },
  data() {
    return {
      is_send:"",
      item:{},
      arr: []
    };
  },
  mounted() {},
  methods: {
    go(res, id) {
      this.$router.push({ name: res, params: { id: id } });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  font-size: 16px;
  color: #c1c1c1;
  [class*="van-hairline"]::after {
    border: 0;
  }
  width: 100%;
  min-height: 640px;
  .van-cell {
    margin-left: -10px;
    width: 100%;
    color: white;
   background:#666666;
  }
  .header{
    font-size: 18px;
    margin: 10px 15px;
  }
  .title{
    word-wrap: break-word;
    font-size: 14px;
    text-indent:20px;
    margin: 10px 15px;
  }
  .card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 92%;
    margin: 10px 15px;
    .button{
      border-radius: 20px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      width: 60px;
      height: 26px;
      background: #FBA318;
    }
    div {
      width: 95%;
      overflow: hidden;
      font-size: 12px;
      margin-bottom: 9px;
      line-height: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .header {
      font-size: 16px;
    }
    .content {
      width: 800px;
      span {
        width: 60px;
      }
      div {
        // margin-left: 15px;
      }
    }
    border-bottom: 1px solid;
  }
}
</style>


// WEBPACK FOOTER //
// src/pages/article/email-detail.vue