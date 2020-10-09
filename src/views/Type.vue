<template>
    <div class="content" style="width:100%;height:100%">
      <div class="top display-flex justify-content align-items flex-wrap " style="width:window.screen.availWidth">
          <div class="box" v-for="item in classList" @click="tofenlei(item.id,1)" style="width:window.screen.availWidth">
             <img :src="baseUrl+item.image" alt=''>
             <p>{{$store.state.Langugeflag ? item.name : item.alias}}</p>
          </div>
      </div>
      <div class="bottom display-flex justify-content align-items flex-wrap">
        <div class="bottom_box" v-for="item in labelList" @click="tofenlei(item.id,2)">
          <img class="labelimg" :src="baseUrl+item.image" alt=''>
          <p>{{$store.state.Langugeflag ? item.name : item.alias}}</p>
        </div>
      </div>
      <bottom></bottom>
    </div>
</template>

<script>
import bottom from "../components/bottom";

import { getClass, getLabel, baseUrl, Ua, Languge,ClassCache,LabelCache } from "../api/index.js";
export default {
  components: {bottom},
  data() {
    return {
      baseUrl: "",
      classList: [],
      classcache:[],
      labelList: [],
      labelcache:[],
      nameFlag: true //中文为true 英文为false
    };
  },
   watch:{
     
  },
  methods: {
    tofenlei(id, num) {
      //1 分类 , 2 标签
      localStorage.setItem("fromPath", '/type');
      localStorage.setItem("msgplay", id);
      this.$router.push({ name: "fenlei", query: { id: id , name:num} });
      localStorage.setItem("fenlei", '/fenlei');
      localStorage.setItem("fenleiid", id);
      localStorage.setItem("fenleiname", num);

    }
  },
  mounted() {
    
    //截取lang前2位字符
    if (Languge() != "zh") {
      this.nameFlag = false;
    }
    this.baseUrl = baseUrl;
    ClassCache().then(res=>{
      this.classList=res;
      getClass().then(data => {
        this.classList = data.msg;
        localForage.setItem("class_cache", this.classList);     
      });
    })

  LabelCache().then(res=>{
      this.labelList=res;
      getLabel().then(data => {
        this.labelList = data.msg;
        localForage.setItem("label_cache", this.labelList);     
      });
  })

  }
};
</script>

<style lang="stylus" scoped>
.top {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-wrap: wrap;
  //width : 400px;
  padding-top: 0.4rem; /* 15/37.5 */
  padding-bottom: 0.533333rem; /* 20/37.5 */
  border-bottom: 0.266667rem /* 10/37.5 */ solid #fff;
}
.labelimg{
  border-radius :50%
}


.box p {
  margin-top: 0.133333rem; /* 5/37.5 */
  font-size: 0.373333rem; /* 14/37.5 */
  color: #462d8b;
}

.top img {
  width: 1.333333rem; /* 50/37.5 *//* 100/37.5 */
  height: 1.333333rem; /* 50/37.5 */
}

.bottom {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-wrap: wrap;
  // display: flex;
  // justify-content: space-around;
  padding: 0.8rem /* 30/37.5 */ 0.266667rem; /* 10/37.5 */
}

// .bottom .bottom_box{
// width 20%;
// display flex
// justify-content center
// align-items center
// flex-direction column
// margin-bottom .666667rem /* 25/37.5 */
// }
.bottom .bottom_box p {
  font-size: 0.293333rem; /* 11/37.5 *//* 13/37.5 */
  margin-top: 0.32rem; /* 12/37.5 */
  color: #462d8b;
}

.bottom .bottom_box img {
  width: 1.146667rem; /* 43/37.5 */
  height: 1.146667rem; /* 43/37.5 */
}
//兼容不同的浏览器
  //是否是弹性盒
  .display-flex{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    }
    //是否铺满剩余
  .flex-item {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    }
    //弹性盒里面的元素横还是竖
  .flex-direction {
      -webkit-box-orient: column;
      -webkit-flex-direction: column;
      -moz-flex-direction: column;
      -ms-flex-direction: column;
      -o-flex-direction: column;
      flex-direction: column;
      }
      //居中
  .justify-content {
      -webkit-box-pack: center;
      -moz-justify-content: center;
      -webkit-justify-content: center;
      justify-content: center;
        }
    .align-items {
      -webkit-box-align: center;
      -moz-align-items: center;
      -webkit-align-items: center;
      align-items: center;
      }
       .flex-wrap{
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap:wrap;
      }




@media all and (orientation: portrait) {
  .box{
  width: 23%;
  height: 2.133333rem; /* 80/37.5 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0.4rem; /* 15/37.5 */
}
  .bottom .bottom_box {
    width: 16%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 0.666667rem; /* 25/37.5 */
  }
}

/* 横屏 */
@media all and (orientation: landscape) {
  .box {
  width: 23%;
  height: 2.133333rem; /* 80/37.5 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0.4rem; /* 15/37.5 */
}
  .bottom .bottom_box {
    width: 12.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 0.666667rem; /* 25/37.5 */
  }
}
</style>

