<template>
  <div>
    <div class="content" style="height:100%;">
      <div v-if="pic==true" style="height:100%;" class="display-flex justify-content align-items">  
          <cell >
            <spinner :size="index === 3 ? '40px' : ''"></spinner>
          </cell>
      </div>

      <div v-if="pic==false" class="cc_home_view" v-for="(item,index) in lists" :key="index">

        <div class="img_two" v-for="(i,index) in item"  @click="dianji(i)">
          <img
            v-lazy="index==0 ? (i.image.indexOf('http')== 0 ? i.image : baseUrl+i.image) :(i.thumbnail.indexOf('http')== 0 ? i.thumbnail : baseUrl+i.thumbnail)"
            class="cc_home_img"
            alt  
          >
          <img
            v-if="i.type==1||i.type==2"
            class="cc_home_img type_img"
            v-lazy="i.type==1 ? iosPic : (i.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(i.url)"
          >
        </div>
      </div>
      <p
        v-if="footerTishi"
        class="display-flex" 
        style="text-align:center;color:#949494;font-size:0.386667rem"
      >
       <div v-if="this.$store.state.Langugeflag == true && footerTishi == false" class="display-flex justify-content">
          <cell>
            <spinner :size="index === 3 ? '40px' : ''"></spinner>
          </cell>
      </div>
      <div v-if="this.$store.state.Langugeflag == false && footerTishi == false" class="display-flex justify-content">
          <cell>
            <spinner :size="index === 3 ? '40px' : ''"></spinner>
          </cell>
      </div>
      <div v-if="this.$store.state.Langugeflag == true && footerTishi == true" class="display-flex justify-content align-items" ><img  style="width:30%;height:50%" :src="cbottom"/><bottom></bottom></div>
      <div v-if="this.$store.state.Langugeflag == false && footerTishi == true" class="display-flex justify-content align-items"><img   style="width:30%;height:50%" :src="ebottom"/><bottom></bottom></div>
      </p>
    </div>
  </div>
</template>

<script>
import bottom from "../components/bottom";

  import {
    cbottom,
    ebottom,
    ios,
    and
  } from "../api/img.js"
import xixi from "../images/xixi.png";
import { Spinner, Group, Cell } from 'vux'
import {
  getHot,
  saveGame,
  clickNum,
  baseUrl,
  Ua,
  Languge,
  scrollBottom,
  HotCache
} from "../api/index.js";
import { setTimeout } from "timers";
export default {
  components: {
    Spinner,
    Cell,
    Group,
    bottom
  },
  data() {
    return {
      lists: [],
      liulan: [],
      liulan_id: [],
      baseUrl: "",//拼接地址
      page: 0,
      footerTishi: false, //提示
      nameFlag: true, //中文为true 英文为false
      iosPic: "",
      andPic: "",
      zhPic: "",
      pic: true,//在加载完成之前显示loading
      index: 0,
      cbottom:'',
      ebottom:''
    };
  },
  created: function (){
    // alert('111')
    window.onload=function () {
        document.addEventListener('touchstart',function (event) {
          if(event.touches.length>1){
            event.preventDefault();
          }
        });
        var lastTouchEnd=0;
        document.addEventListener('touchend',function (event) {
          var now=(new Date()).getTime();
          if(now-lastTouchEnd<=300){
            event.preventDefault();
          }
          lastTouchEnd=now;
        },false);
        document.addEventListener('gesturestart', function (event) {
          event.preventDefault();
        });
      }
  },
  watch: {
    //当接口没有游戏返回时取消滚动事件
    footerTishi(value) {
      var con = doc(".content");
      con.removeEventListener("scroll", this.scrollfun);
      
    }
  },
  methods: {
    dian(item){

    },
    //当为安卓或ios时
    sendUrl: function(gameurl) {
        if (window.webkit) {
          var param = {
            type: "openappstore",
            url: gameurl
          };
          window.webkit.messageHandlers.girlBoxGame.postMessage(param);
        } else {
          window.open(gameurl)
        }
      if (window.girlBoxGame) {
        girlBoxGame.visit(gameurl);
      }
      location.hash = `#/hot?air=1&openappstore=${gameurl}`;
    },
    //游戏跳转
    dianji: function(arr) {
        localStorage.setItem("fromPath", '/hot');
        localStorage.setItem("msgplay", arr.id);
       localStorage.setItem("url",baseUrl+arr.url);
       localStorage.setItem("gameLabel",arr.gameLabel[0].id);
               if (arr.type == 0) {
      // 获取之前存取的数据,存新的游戏
      saveGame(this.liulan, this.liulan_id, arr, arr.id);
      //点击量
      clickNum({ id: arr.id }).then(res => {});
      // 传横竖屏
      var direction;
      if (arr.screen == 1) {
        direction = "land";
      } else {
        direction = "port";
      }
      // if (window.webkit.messageHandlers.girlBoxGame) {
      //   window.webkit.messageHandlers.girlBoxGame.postMessage(direction);
      // }
      if (window.girlBoxGame) {
        girlBoxGame.direction(direction);
      }
      // location.hash = `#/hot?air=1&direction=${direction}`;
      localStorage.setItem("screenWidth", docEl.clientWidth);
      localStorage.setItem(
        "screenHidth",
        docEl.clientHeight
      );
      localStorage.setItem("gameLabel",arr.gameLabel[0].id);
      arr.air = 1
      arr.direction = direction
      localStorage.setItem('screen',arr.screen) //存取屏幕横屏或竖屏
      this.$router.push({ name: "game", query: arr });
              // if (window.webkit) {           
        // if(window.webkit.messageHandlers.girlBoxGame){
        //  window.webkit.messageHandlers.girlBoxGame.postMessage(direction);
        // }
      // }
               }
    },
    //滚动触发
    scrollfun: function() {
      var con = doc(".content");
      con.style.overflow = "scroll";
      var scrollTop = con.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight = con.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = con.scrollHeight;
      //滚动条到底部的条件
      if (scrollTop + windowHeight + 20 > scrollHeight) {
        getHot({ page: this.page++, type: Ua }).then(res => {
          var arr = res.msg;
          if (arr.length > 9) {
            var arr_2 = arr.splice(9);
          }
          if (res.state == "1") {
            this.lists.push(arr);
            if (arr.length > 9) {
              this.lists.push(arr_2);
            }
          } else {
            this.footerTishi = true;
          }
        });
      }
    }
  },
  mounted() {
    this.cbottom=cbottom;
    this.ebottom=ebottom;
    this.iosPic = ios;
    this.andPic = and;
    this.zhPic  = xixi;
    //判断语言
    if (Languge() != "zh") {
      this.nameFlag = false;
    }
    this.baseUrl = baseUrl;

    var fun = () => {
      getHot({ page: this.page++, type: Ua }).then(res => {
        this.pic = false;
        if (res.state == "1") {
          var arr = res.msg;
          if (arr.length > 9) {
            var arr_2 = arr.splice(9);
            this.lists.push(arr);
            this.lists.push(arr_2);
          } else {
            this.lists.push(arr);
          }
          localForage.setItem("hot_cache", this.lists);
        } else {
          this.footerTishi = true;
        }
      });
    };

    //获取缓存
    HotCache().then(res => {
      this.lists = res;
      //获取游戏
      getHot({ page: this.page++, type: Ua }).then(res => {
        if (res.state == "1") {
          var arr = res.msg;
          if (arr.length > 9) {
            var arr_2 = arr.splice(9);
            this.lists = [arr, arr_2];
          } else {
            this.lists = [arr];
          }
          //缓存
          localForage.setItem("hot_cache", this.lists);
          fun();
        }
      });
    });
    var con =  doc(".content");
    con.style.overflow = "scroll";
    con.addEventListener("scroll", this.scrollfun);
  }
};
</script>
<style lang="stylus" scoped>
.content {
  padding: 0.186667rem 0.24rem;
}
.cc_home_view:after {
  display: table;
  content: '';
  clear: both;
}
.cc_home_view {
  font-size: 0;

  .img_two {
    position: relative;
    z-index 99999
  }
 .img_two:nth-child(1) .cc_home_img {
    height: 4.55rem 
    
    width: 4.55rem
  }
  .cc_home_img {
    height: 2.18rem /* 82/37.5 */
    width: 2.18rem;
    border-radius: 12%;
  }
  .type_img {
    position: absolute;
    top: 0;
    left: 0; /* 1/37.5 */
  }
}
 //兼容不同的浏览器
  //是否是弹性盒
  .display-flex{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-direction : column;

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
      -webkit-box-orient: vertical;
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
      -webkit-flex-wrap:wrap;
      -webkit-box-lines:multiple;
      -moz-flex-wrap:wrap;
      flex-wrap:wrap;
      }
/* 竖屏 */
@media all and (orientation: portrait) {
  .img_two:nth-child(1) {
    float: left;
  }
  .img_two {
    margin: 0.106667rem 0.08rem;
    float: left;
  }
}
/* 横屏 */
@media all and (orientation: landscape) {
  .img_two:nth-child(1) {
    margin-left: 0.16rem;
  }

  .img_two {
    margin: 0.106667rem 0.266667rem;
    float: left;
  }
}
</style>



