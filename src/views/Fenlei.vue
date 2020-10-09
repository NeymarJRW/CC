<template>
  <div>
    <div class="content" ref="content">
      <div v-if="nogame==true" class="screentishi" ref="screentishi" id="screentishi">
        <div class="top">
          <p>{{this.$store.state.Langugeflag ? '提示' : 'Tips'}}</p>
        </div>
        <div class="middle">
          <p>{{this.$store.state.Langugeflag ? '游戏不断完善中,敬请期待' : 'Please rotate the screen'}}</p>
          <button @click="backtype">{{this.$store.state.Langugeflag ? '确定' : 'close'}}</button>
        </div>
      </div>

      <div class="top">
        <img src="../images/logo.png" alt />
      </div>
      <div class="fanhui" @click="back">
        <img src="../images/back.png" alt />
      </div>

      <div v-if="pic==true" style="height:100%;" class="display-flex justify-content align-items">
        <cell>
          <spinner :size="index === 3 ? '40px' : ''"></spinner>
        </cell>
      </div>
      <div class="gamebox" style="width:100%;height:100%;float:right">
        <div class="img_two" v-for="(i,index) in fanhuiyouxi" @click="dianji(i)">
          <img
            v-lazy="i.thumbnail.indexOf('http')== 0 ? i.thumbnail : baseUrl+i.thumbnail"
            class="cc_home_img"
            alt
          />
          <img
            v-if="i.type==1||i.type==2"
            class="cc_home_img type_img"
            v-lazy="i.type==1 ? iosPic : (i.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(i.url)"
          />
        </div>
      </div>
        <!-- <p
       class="tishi"
       v-if="footerTishi == true"
       style="text-align:center;color:#949494;font-size:0.386667rem"
        >{{nameFlag ? '没有游戏了...' :'No more games...'}}</p>-->
        <!-- v-if="nameFlag == true && footerTishi == true"  -->

          <div v-if="nameFlag == true && footerTishi == true" class="tishi display-flex justify-content align-items">
           
            <img style="width:100%;height:100%" :src="cbottom" />
          </div>
          <div
            v-if="nameFlag == false && footerTishi == true"
            class="tishi display-flex justify-content align-items"
          >
            <img style="width:100%;height:100%" :src="ebottom" />
          </div> 


        <!-- <p>sssssssssssss</p> -->

    </div>
  </div>
</template>

<script>
import { cbottom, ebottom, ios, and } from "../api/img.js";
import { Spinner, Group, Cell } from "vux";
import {
  saveGame,
  clickNum,
  idReturnClass,
  idReturnLabel,
  baseUrl,
  Ua,
  scrollBottom,
  Languge
} from "../api/index.js";
export default {
  components: {
    Spinner,
    Cell,
    Group
  },
  data() {
    return {
      index: 0,
      fanhuiyouxi: [],
      liulan: [],
      liulan_id: [],
      xiala_name: "",
      //baseUrl: "",
      page: 0,
      footerTishi: false,
      nameFlag: true,
      iosPic: "",
      andPic: "",
      test: false,
      pic: true, //在加载完成之前显示loading,
      cbottom: "",
      ebottom: "",
      language: true,
      nogame: false
    };
  },
  watch: {
    footerTishi(value) {
      // alert(value);
      // alert(value)
      var content = doc(".content");
      var gamebox = doc(".gamebox");
      // alert(gamebox.scrollHeight)
      // alert(content.clientHeight)
      if (gamebox.scrollHeight !== "null") {
        if (gamebox.scrollHeight >= content.clientHeight) {
          // this.footerTishi=false
          // alert(11111111111111111111)
          gamebox.removeEventListener("scroll", this.scrollfun);
        }
      }
    }
  },
  $route(to, from) {
    if (to.path == "/fenlei") {
      this.getData();
    }
    if (from.path == "/type") {
      this.footerTishi = false;
      this.pic = true;
    }
  },
  methods: {
    backtype() {
      this.$router.go(-1);
    },
    sendUrl: function(gameurl) {
      if (window.webkit) {
        var param = {
          type: "openappstore",
          url: gameurl
        };
        window.webkit.messageHandlers.girlBoxGame.postMessage(param);
      }
      if (window.girlBoxGame) {
        girlBoxGame.visit(gameurl);
      }
      var pinjie = `type=openappstore&url=${gameurl}`;
      iframeSend(pinjie);
    },
    back() {
      this.footerTishi = false
      this.pic = true
      this.$router.push({
        path: "/type"
      });
    },
    dianji: function(arr) {
      this.footerTishi = false;
      this.pic = true;
      localStorage.setItem("gameLabel", arr.gameLabel[0].id);
      localStorage.setItem("fromPath", localStorage.getItem("fenlei"));
      saveGame(this.liulan, this.liulan_id, arr, arr.id);
      //点击量
      clickNum({ id: arr.id }).then(res => {});
      //传横竖屏
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
      // location.hash=`#/fenlei?air=1&direction=${direction}`
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      localStorage.setItem("screenWidth", w);
      localStorage.setItem("screenHidth", h);
      arr.air = 1;
      arr.direction = direction;
      localStorage.setItem("screen", arr.screen); //存取屏幕横屏或竖屏
      this.$router.push({ name: "game", query: arr });
      // if (window.webkit) {
      if (window.webkit.messageHandlers.girlBoxGame) {
        window.webkit.messageHandlers.girlBoxGame.postMessage(direction);
      }
      // }
    },
    scrollfun: function() {
      var con = doc(".content");
      var scrollTop = con.scrollTop; //变量windowHeight是可视区的高度
      var windowHeight = con.clientHeight; //变量scrollHeight是滚动条的总高度
      var scrollHeight = con.scrollHeight; //滚动条到底部的条件
      // console.log("windowHeight" + windowHeight);
      if (scrollTop + windowHeight == scrollHeight) {
        //写后台加载数据的函数
        if (this.$route.query.name == 1) {
          //分类
          this.baseUrl = baseUrl;
          idReturnClass({
            cId: this.$route.query.id,
            page: this.page++,
            type: Ua
          }).then(res => {
            if (res.state == "1") {
              res.msg.forEach(item => {
                this.fanhuiyouxi.push(item);
              });
              //  console.log("2222222222222222222222222222222222")
            } else {
              //  console.log("11111111111111111111111111111111111111111111")
              this.footerTishi = true;
            }
          });
        } else {
          //标签
          idReturnLabel({
            lId: this.$route.query.id,
            page: this.page++,
            type: Ua
          }).then(res => {
            if (res.state == "1") {
              res.msg.forEach(item => {
                this.fanhuiyouxi.push(item);
              });
            } else {
              this.footerTishi = true;
            }
          });
        }
      }
    },
    getData() {
      this.cbottom = cbottom;
      this.ebottom = ebottom;
      // if (Languge() != "zh") {
      //   this.nameFlag = false;
      // } else {
      //   this.nameFlag = true;
      // }
      this.iosPic = ios;
      this.andPic = and;
      this.baseUrl = baseUrl;
      var h = docEl.clientHeight;
      var w = docEl.clientWidth;
      var gamebox = doc(".gamebox");
      this.fanhuiyouxi = [];
      this.page = 0;
      var fun = () => {
        this.pic = false;
        if (this.$route.query.name == "1") {
          idReturnClass({
            cId: this.$route.query.id,
            page: this.page++,
            type: Ua
          }).then(res => {
            if (res.state == "1") {
              for (var index in res.msg) {
                this.fanhuiyouxi.push(res.msg[index]);
              }
              if (this.page < 4) {
                fun();
              }
            } else {
              this.pic = false;
              this.footerTishi = true;
            }
          });
        } else {
          idReturnLabel({
            lId: this.$route.query.id,
            page: this.page++,
            type: Ua
          }).then(res => {
            if (res.state == "1") {
              for (var index in res.msg) {
                this.fanhuiyouxi.push(res.msg[index]);
              }
              if (this.page < 4) {
                fun();
              }
            } else {
              this.pic = false;
              this.footerTishi = true;
            }
          });
        }
      };
      if (this.$route.query.name == "1") {
        idReturnClass({
          cId: this.$route.query.id,
          page: this.page++,
          type: Ua
        }).then(res => {
          if (res.state == "1") {
            for (var index in res.msg) {
              this.fanhuiyouxi.push(res.msg[index]);
            }
            fun();
          } else {
            this.nogame = true;
            this.pic = false;
            this.footerTishi = true;
          }
        });
      } else {
        idReturnLabel({
          lId: this.$route.query.id,
          page: this.page++,
          type: Ua
        }).then(res => {
          if (res.state == "1") {
            this.fanhuiyouxi = res.msg;
            fun();
          } else {
            this.nogame = true;
            this.pic = false;
            this.footerTishi = true;
          }
        });
      }
      gamebox.addEventListener("scroll", this.scrollfun);
      window.addEventListener("resize", () => {
        var content = doc(".content");
        var gamebox = doc(".gamebox");
        if (gamebox) {
          if (gamebox.scrollHeight !== "null") {
            if (gamebox.scrollHeight <= content.clientHeight) {
              this.footerTishi = false;
              // alert(this.footerTishi)
              gamebox.removeEventListener("scroll", this.scrollfun);
            }
          }
        }
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="stylus" scoped>
.tishi{
  width 100%
  height 1.333333rem /* 50/37.5 */ /* 20/37.5 */
}
.tishi img{

}
.screentishi {
  width: 5.946667rem;
  border-radius: 20px;
  background: pink;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fffefe;
  z-index: 1;
  // display: none;
}

.screentishi .top {
  height: 0.8rem; /* 30/37.5 */
  /* 45/37.5 */
  background: #ee436d;
  text-align: center;
  font-size: 0.32rem; /* 12/37.5 */
  /* 15/37.5 */
  color: white;
  line-height: 0.8rem; /* 30/37.5 */
  /* 45/37.5 */
  padding: 0 0.4rem;
}

.screentishi .middle {
  /* 130/37.5 */
  font-size: 0.373333rem; /* 14/37.5 */
  text-align: center;
  box-sizing: border-box;
  padding: 0.293333rem 0.266667rem 0.2rem 0.266667rem;
}

.screentishi .middle p {
  padding: 0.266667rem /* 10/37.5 */ 0;
}

.screentishi .middle button {
  width: 1.333333rem; /* 50/37.5 */
  height: 0.533333rem; /* 20/37.5 */
  background: #ee436d;
  border: none;
  border-radius: 0.16rem; /* 6/37.5 */
  color: #fff;
}

.gamebox {
  padding-bottom: 1.5rem;
  overflow-y: auto;
  // overflow hidden
}

.gamebox:after {
  display: table;
  content: '';
  clear: both;
}

// 是否是弹性盒
.display-flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-item {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.flex-direction {
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}

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

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -webkit-box-lines: multiple;
  -moz-flex-wrap: wrap;
  flex-wrap: wrap;
}

@media all and (orientation: portrait) {
  .fanhui {
    width: 0.933333rem; /* 35/37.5 */
    height: 0.933333rem; /* 35/37.5 */
    font-size: 0.48rem; /* 18/37.5 */
    position: absolute;
    // top:.533333rem /* 20/37.5 */
    top: 0.266667rem; /* 10/37.5 */
    left: 0.133333rem; /* 5/37.5 */
    color: #fff;
    z-index: 10000;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 0 0 0 0.32rem;
  }

  .content .img_two {
    float: left;
    width: 2.186667rem; /* 82/37.5 */
    height: 2.186667rem; /* 82/37.5 */
    margin: 0.266667rem 0.186667rem 0 0;
    position: relative;
    overflow: hidden;
  }

  .content .img_two .cc_home_img {
    height: 2.186667rem;
    width: 2.186667rem;
    border-radius: 12%;
  }

  .content .img_two .type_img {
    position: absolute;
    top: 0;
    left: 0; /* 1/37.5 */
  }

  .content>.top {
    display: none;
  }

  .fanhui img {
    width: 0.933333rem; /* 35/37.5 */
    height: 0.933333rem; /* 35/37.5 */
    z-index: 10000;
  }
}

@media all and (orientation: landscape) {
  .content {
    width: 100%;
    height: 100%;
    padding: 0 0 0 0.32rem;
  }

  // .content  p{
  // clear:both

  // }
  .content .img_two {
    width: 2.186667rem; /* 82/37.5 */
    height: 2.186667rem; /* 82/37.5 */
    float: left;
    margin: 0.266667rem 0.48rem /* 18/37.5 */ /* 20/37.5 */ 0 0;
    position: relative;
  }

  .content .img_two .cc_home_img {
    height: 2.186667rem;
    width: 2.186667rem;
    border-radius: 12%;
  }

  .content .img_two .type_img {
    position: absolute;
    top: 0;
    left: 0; /* 1/37.5 */
  }

  .content>.top {
    background: #ee436d;
    height: 100%;
    width: 1.333333rem; /* 50/37.5 */
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    justify-content: center;
  }

  .fanhui {
    position: absolute;
    left: 0;
  }

  .fanhui img {
    width: 1.066667rem; /* 40/37.5 */
    height: 1.066667rem; /* 40/37.5 */
  }

  .content>.top img {
    width: 1.333333rem; /* 50/37.5 */
    height: 0.8rem; /* 30/37.5 */
    transform: translate(0, -50%);
  }
}
</style>

