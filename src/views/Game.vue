<template>
  <div class="content" id="content">
    <div id="ball" class="ball" ref="ball" @click="display">
      <i class="ball_message"></i>
      <span @click="display"></span>
    </div>
    <div class="screentishi" ref="screentishi" id="screentishi">
      <div class="top">
        <p>{{language==true ? '提示:请旋转屏幕' : 'Tips:Please rotate the screen'}}</p>
      </div>
      <div class="middle">
        <img :src='Rotate' alt="">
      </div>
    </div>
    <div class="tishi" ref="tishi" id="tishi">
      <div class="top">
        <template v-if="nameFlag == false">FOR YOU</template>
        <template v-if="nameFlag == true">猜你喜欢</template>
        <img src="../images/game/close.png" alt @click="hide">
      </div>
      <div class="middle">
        <div class="img_two" v-for="(i,index) in foryou" @click="togame(i)">
          <img :src="baseUrl+i.thumbnail" class="cc_home_img" alt>
          <img
            v-if="i.type==1||i.type==2"
            class="cc_home_img type_img"
            :src="i.type==1 ? iosPic : (i.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(i.url)"
          >
        </div>
        <div class="clear" style="clear:both"></div>
      </div>
      <div class="bottom">
        <img src="../images/game/back.png" alt @click="back">
        <img src="../images/game/refresh.png" alt @click="refresh">
        <img
          src="../images/game/uncollection.png"
          class="collection"
          ref="collection"
          alt
          @click="collection"
        >
        <!-- <img v-if="noweixin" src="../images/game/share.png" alt @click="share"> -->
      </div>
    </div>
    <div class="iframe" id="iframeout">
      <!-- <iframe class="iframe" :src="url" frameborder="0" scrolling="no" id="iframe" ref="iframe"></iframe> -->
      <!-- sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation" -->
      <!-- <div id="mainContainer">
      <div id="content">-->
      <!-- <video id="contentElement" playsinline muted>
                  <source src="http://rmcdn.2mdn.net/Demo/vast_inspector/android.mp4">
                  </source>
                  <source src="http://rmcdn.2mdn.net/Demo/vast_inspector/android.webm">
                  </source>
      </video>-->
      <!-- </div>
               <button id="playButton">Play</button>
              <div id="adContainer"></div>
      </div>-->
    </div>
    <!-- 广告 -->
    <!-- <div class="ad">
      <div id="adsgoeshere" style=" text-align: center;" v-html="adsenseContent" ></div>
      <div class="close" @click="adhide"></div>
    </div>-->
  </div>
</template>

<script>
import { initAd } from "../api/ad";
import { cbottom, ebottom, ios, and } from "../api/img.js";
import {
  saveGame,
  clickNum,
  returnGame,
  baseUrl,
  Ball,
  Ua,
  Languge,
  getHome
} from "../api/index.js";
import collection from "../images/game/collection.png";
import uncollection from "../images/game/uncollection.png";
import $ from "jquery";
import { clearTimeout } from "timers";
import {rotate} from "../api/img";
// import func from '../../vue-temp/vue-editor-bridge';

export default {
  data() {
    return {
      Rotate:'',//旋转提示图片地址
      adsenseContent: "",
      screenFlag: 0, //屏幕旋转flag ,0:小球代码未执行,1:小球已执行
      foryou: [],
      url: "",
      collection_flag: true, //未收藏
      like_game: [],
      like_gamedata: [],
      like_id: [],
      like_iddata: "",
      back_num: 1,
      liulan: [],
      liulan_id: [],
      iosPic: "",
      andPic: "",
      pinjie: "",
      pinjieflag: false,
      nameFlag: true, //中文为true 英文为false,,
      gamescreen: 0, //横屏竖屏,
      closead: false, // 定时器结束时为true 可以关闭广告
      adFlag: true, //广告关闭后为false 为true时表示广告存在
      noweixin: true, //true 不是小程序 false为小程序
      timeFlag: false, //定时器正在运行时为true 不运行时为false
      timer: "", //定时器,
      message: "",
      language: true,
    };
  },
  watch: {
    pinjieflag(value) {
      location.hash = "#/game?" + this.pinjie;
    },
    $route(to, from) {
      if (to.path === "/game") {
        this.getData();
      }
      if (from.path === "/fenlei") {
        localStorage.setItem("fromPath", localStorage.getItem("fenlei"));
      }
    }
  },
  methods: {
    adhide() {
      var ad = doc(".ad");
      if (this.closead) {
        ad.style.display = "none";
        this.adFlag = false;
      }
    },
    sendUrl(gameurl) {
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
      location.hash = `#/game?air=1&openappstore=${gameurl}`;
    },
    display() {
      this.$refs.tishi.style.display = "block";
      //判断游戏是否收藏过
      var like_id = this.like_iddata;
      var like_img = this.$refs.collection;
      localForage.getItem("like_id").then(res => {
        if (res) {
          if (res.indexOf(like_id) == -1) {
            // console.log("没收藏")
            this.collection_flag = true;
            like_img.src = uncollection;
          } else {
            this.collection_flag = false;
            like_img.src = collection;
          }
        }
      });
    },
    togame(item) {
      window.removeEventListener("message", this.message);
      // alert('55555')
      // clearInterval(this.timer)
      // (this.adsenseContent = ""), (this.closead = false);
      this.adFlag = true;
      this.timeFlag = false;
      //获取之前存取的数据
      saveGame(this.liulan, this.liulan_id, item, item.id);
      //点击量
      clickNum({
        id: item.id
      }).then(res => {});
      //传横竖屏
      var direction;
      if (item.screen == 1) {
        direction = "land";
      } else {
        direction = "port";
      }

      if (window.girlBoxGame) {
        girlBoxGame.direction(direction);
      }
      // localStorage.setItem("url", baseUrl + item.url);
      // localStorage.setItem("msgplay", item.id);
      item.air = 1;
      item.direction = direction;
      localStorage.setItem("gameLabel", item.gameLabel[0].id);
      localStorage.setItem("screen", item.screen); //存取屏幕横屏或竖屏
      localStorage.setItem("gamePage", "game"); //在游戏点击跳转游戏
      // this.getforyou();
      if (doc("#iframe")) {
        var iframe = doc("#iframe");
        $("#iframeout").empty(iframe);
      }
      this.$router.push({
        name: "game",
        query: item
      });
      this.hide();
      // if (window.webkit.messageHandlers.girlBoxGame) {
      //   window.webkit.messageHandlers.girlBoxGame.postMessage(direction);
      // }
      // window.location.reload();
      //  Ball()
      // this.$router.push({
      //   path: "/game?id=" + localStorage.getItem('msgplay')
      // });
      // if(document.getElementById("iframe")) {
      //   document.getElementById("iframe").src = localStorage.getItem('url')
      // }
      // if(document.getElementById("tishi")) {
      //   document.getElementById("tishi").style.display = "none"
      // }
    },
    hide() {
      this.$refs.tishi.style.display = "none";
    },
    back() {
      if (window.girlBoxGame) {
        girlBoxGame.direction("return");
      }
      window.removeEventListener("resize", this.listenGame);
      var str = `0,100`;
      localStorage.setItem("Inertia_ball", str);
      if (doc("#iframe")) {
        var iframe = doc("#iframe");
        $("#iframeout").empty(iframe);
      }
      this.$router.push({
        path: localStorage.getItem("fromPath") + "?air=1&return=1",
        query: {
          id: localStorage.getItem("fenleiid"),
          name: localStorage.getItem("fenleiname")
        }
      });
      document.getElementById("tishi").style.display = "none";
      localStorage.setItem("gamePage", "quit"); //在游戏点击跳转游戏
      // if (window.webkit) {
      // if (window.webkit.messageHandlers.girlBoxGame) {
      //   window.webkit.messageHandlers.girlBoxGame.postMessage("return");
      // }
      // }
    },
    collection() {
      
      var like_id = this.like_iddata;
      var that = this;
      if (this.collection_flag) {
        localForage.getItem("like").then(data => {
          if (data) {
            localForage.getItem("like_id").then(res => {
              //设置长度
              if (res.indexOf(like_id) == -1) {
                if (data.length >= 10) {
                  data.shift();
                  res.shift();
                }
                this.like_game = data;
                this.like_game.push(this.like_gamedata);
                this.like_id = res;
                this.like_id.push(this.like_iddata);
                localForage.setItem("like", this.like_game); //存浏览游戏数据
                localForage.setItem("like_id", this.like_id);
              } else {
                this.like_game = data;
                this.like_id = res;
                localForage.setItem("like", this.like_game); //存浏览游戏数据
                localForage.setItem("like_id", this.like_id);
              }
            });
          } else {
            this.like_game.push(this.like_gamedata);
            this.like_id.push(this.like_iddata);
            localForage.setItem("like", this.like_game);
            localForage.setItem("like_id", this.like_id);
          }
        });
        this.$refs.collection.src = collection;
        this.collection_flag = false;
      } else {
        localForage.getItem("like_id").then(function(res) {
          var num = res.indexOf(like_id);
          res.splice(num, 1);
          localForage.getItem("like").then(function(data) {
            data.splice(num, 1);
            that.like_game = data;
            that.like_id = res;
            localForage.setItem("like", that.like_game); //存浏览游戏数据
            localForage.setItem("like_id", that.like_id);
          });
        });
        this.$refs.collection.src = uncollection;
        this.collection_flag = true;
      }
    },
    refresh() {
      var iframe = document.getElementById("iframe");
      if (iframe) {
        iframe.src = iframe.src;
      }
      if (document.getElementById("tishi")) {
        document.getElementById("tishi").style.display = "none";
      }
    },
    getforyou() {
      if (this.$route.query.gameLabel) {
        returnGame({
          glId: localStorage.getItem("gameLabel")
        }).then(res => {
          if (res.state == 1) {
            // console.log(this.$route.query.id)
            localForage.getItem("liulan_id").then(liulan_id => {
              // log('------------liulan_id--------------------')
              // console.error(liulan_id)
              if (liulan_id.length > 0) {
                var foryou_arr = res.msg;
                var newarr3 = foryou_arr.filter(item => {
                  if (item.id != this.$route.query.id) {
                    return item;
                  }
                });
                var newarr = newarr3.filter(item => {
                  if (liulan_id.indexOf(item.id) == -1) {
                    return item;
                  }
                });
                localForage.getItem("like_id").then(like_id => {
                  if (like_id && like_id.length > 0) {
                    var newarr2 = newarr.filter(item => {
                      if (like_id.indexOf(item.id) == -1) {
                        return item;
                      }
                    });
                    if (newarr2.length == 0) {
                      // alert('6666666666666666666666')
                      getHome({ page: 0, type: Ua }).then(res => {
                        log(res.msg);
                        var arr = [];
                        for (var key in res.msg) {
                          arr.push(res.msg[key]);
                        }
                        arr[0].splice(4);
                        this.foryou = arr[0];
                      });
                    } else {
                      if (newarr2.length > 8) {
                        newarr.splice(8);
                      }
                      this.foryou = newarr2;
                    }
                  } else {
                    if (newarr.length == 0) {
                      // alert('5555555555555555555')
                      getHome({ page: 0, type: Ua }).then(res => {
                        var arr = [];
                        for (var key in res.msg) {
                          arr.push(res.msg[key]);
                        }
                        arr[0].splice(4);
                        this.foryou = arr[0];
                      });
                    } else {
                      if (newarr.length > 8) {
                        newarr.splice(8);
                      }
                      this.foryou = newarr;
                    }
                  }
                });
              } else {
                if (res.msg.length > 8) {
                  res.msg.splice(8);
                }
                this.foryou = res.msg;
              }
            });
          }
        });
      }
    },
    listenGame() {
      this.$refs.tishi.style.display = "none";
      var gamescreen = localStorage.getItem("screen");
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      function ball() {
        setTimeout(() => {
          var w = docEl.clientWidth;
          var h = docEl.clientHeight;
          var str = `-10,100`;
          localStorage.setItem("Inertia_ball", str);
          Ball();
        }, 400);
      }
      if (gamescreen == 1) {
        //游戏横屏
        if (w < h) {
          //界面竖屏
          if (doc(".ad")) {
            doc(".ad").style.display = "none";
          }
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "0";
          }
          // this.$refs.ball.style.display = "none";
        } else {
          if (doc(".ad")) {
            if (this.adFlag) {
              doc(".ad").style.display = "block";
              if (!this.timeFlag) {
                this.closeAd();
              }
            }
          }
          if (!doc("#iframe")) {
            var iframe = document.createElement("iframe");
            iframe.style.background = "#333";
            iframe.src = this.url;
            iframe.setAttribute("id", "iframe");
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute(
              "sandbox",
              "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
            );
            $("#iframeout").append(iframe);

            initAd();
          }
          if (this.screenFlag == 0) {
            ball();
            this.screenFlag = 1;
          }
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "1";
          }
          //
          this.$refs.ball.style.display = "block";
        }
      } else {
        //游戏竖屏
        if (w > h) {
          //界面横屏
          if (doc(".ad")) {
            doc(".ad").style.display = "none";
          }
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "0";
          }
          // this.$refs.ball.style.display = "none";
        } else {
          if (doc(".ad")) {
            if (this.adFlag) {
              doc(".ad").style.display = "block";
              if (!this.timeFlag) {
                this.closeAd();
              }
            }
          }
          if (!doc("#iframe")) {
            var iframe = document.createElement("iframe");
            iframe.style.background = "#333";
            iframe.src = this.url;
            // iframe.className ='iframe'
            iframe.setAttribute("id", "iframe");
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute(
              "sandbox",
              "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
            );
            $("#iframeout").append(iframe);

            initAd();
          }
          if (this.screenFlag == 0) {
            ball();
            this.screenFlag = 1;
          }
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "1";
          }
          this.$refs.ball.style.display = "block";
        }
      }
      setTimeout(function() {
        if (doc("#iframe")) {
          doc("#iframe").style.width = w + "px";
          doc("#iframe").style.height = h + "px";
        }
      }, 200);
      if (window.girlBoxGame) {
        //iframe.style.display = "block";
        if (doc("#iframe")) {
          doc("#iframe").style.opacity = "1";
        }
        this.$refs.ball.style.display = "block";
      }
      // this.$refs.tishi.style.display = "block";
    },
    iframeOnload() {
      function ball() {
        setTimeout(() => {
          var w = docEl.clientWidth;
          var h = docEl.clientHeight;
          var str = `-10,100`;
          localStorage.setItem("Inertia_ball", str);
          Ball();
        }, 200);
      }

      var content = doc(".content");
      content.style.background = "#333";
      var that = this;
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      var gamescreen = localStorage.getItem("screen");
      // alert(gamescreen)
      if (gamescreen == 1) {
        //游戏横屏
        if (w < h) {
          //界面竖屏
          if (doc(".ad")) {
            doc(".ad").style.display = "none";
          }
          // this.$refs.ball.style.display = "none";
        } else {
          //界面横屏
          if (doc(".ad")) {
            if (this.adFlag) {
              doc(".ad").style.display = "block";
              if (!this.timeFlag) {
                this.closeAd();
              }
            }
          }

          //创建iframe
          if (!doc("#iframe")) {
            var iframe = document.createElement("iframe");
            iframe.style.background = "#333";
            iframe.src = this.url;
            // iframe.src=` https://www.cicigirl.com/Public/Game/201905241546518776/`
            // iframe.className ='iframe'
            iframe.setAttribute("id", "iframe");
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute(
              "sandbox",
              "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
            );
            $("#iframeout").append(iframe);
            //  wx.miniProgram.navigateTo({
            //       url: "/pages/ads/index"
            //     });
            initAd();
          }
          if (
            !localStorage.getItem("gamePage") ||
            localStorage.getItem("gamePage") == "quit"
          ) {
            ball();
          }
          this.screenFlag = 1;
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "1";
          }
          this.$refs.ball.style.display = "block";
        }
      } else {
        //游戏竖屏
        if (w > h) {
          //界面横屏
          if (doc(".ad")) {
            doc(".ad").style.display = "none";
          }
          // this.$refs.ball.style.display = "none";
        } else {
          //界面竖屏
          if (doc(".ad")) {
            if (this.adFlag) {
              doc(".ad").style.display = "block";
              if (!this.timeFlag) {
                this.closeAd();
              }
            }
          }
          //创建iframe
          if (!doc("#iframe")) {
            var iframe = document.createElement("iframe");
            iframe.style.background = "#333";
            iframe.src = this.url;
            // iframe.className ='iframe'
            iframe.setAttribute("id", "iframe");
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute(
              "sandbox",
              "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
            );
            $("#iframeout").append(iframe);

            initAd();
          }
          if (
            !localStorage.getItem("gamePage") ||
            localStorage.getItem("gamePage") == "quit"
          ) {
            ball();
          }
          this.screenFlag = 1;
          if (doc("#iframe")) {
            doc("#iframe").style.opacity = "1";
          }
          this.$refs.ball.style.display = "block";
        }
      }
      if (doc("#iframe")) {
        doc("#iframe").style.height = h + "px";
        doc("#iframe").style.width = w + "px";
      }

      if (window.girlBoxGame) {
        if (doc("#iframe")) {
          doc("#iframe").style.opacity = "1";
        }
        this.$refs.ball.style.display = "block";
      }
      // }
      var direction;
      if (this.$route.query.screen == 1) {
        direction = "land";
      } else {
        direction = "port";
      }
      // location.hash = `#/game?air=1&direction=${direction}`
      if (Languge() != "zh") {
        this.nameFlag = false;
      }
    },
    closeAd() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timeFlag = true;
      if (Languge() != "zh") {
        this.nameFlag = false;
      }
      var ad = doc(".ad");
      if (ad) {
        if (this.nameFlag) {
          //中文
          var closeBtn = ad.querySelector(".close");
          closeBtn.innerHTML = ` `;
          var num = 5;
          this.timer = setInterval(() => {
            closeBtn.innerHTML = ` <input type="button" value="${num}秒后可关闭广告" >`;
            closeBtn.querySelector("input").style.cssText = `
                      width: 3rem; 
                      height: 0.533333rem;
                      position: absolute;
                      bottom: 0.533333rem; 
                      right: 0.533333rem; `;
            num--;
            if (num < 0) {
              this.closead = true;
              closeBtn.innerHTML = ` <input type="button" value="关闭" >`;
              closeBtn.querySelector("input").style.cssText = `
                              width: 2rem; 
                              height: 0.533333rem;
                              position: absolute;
                              bottom: 0.533333rem; 
                              right: 0.533333rem; `;
              clearInterval(this.timer);
            }
          }, 1000);
        } else {
          var closeBtn = ad.querySelector(".close");
          closeBtn.innerHTML = ` <input type="button" value="关闭"  style='display:none'>`;
          var num = 5;
          this.timer = setInterval(() => {
            closeBtn.innerHTML = ` <input type="button" value="Close the ad in ${num} seconds" @click='adhide'>`;
            closeBtn.querySelector("input").style.cssText = `
                      width: 3rem; 
                      height: 0.533333rem;
                      position: absolute;
                      bottom: 0.533333rem; 
                      right: 0.533333rem; `;
            num--;
            if (num < 0) {
              this.closead = true;
              closeBtn.innerHTML = ` <input type="button" value="close" >`;
              closeBtn.querySelector("input").style.cssText = `
                              width: 2rem; 
                              height: 0.533333rem;
                              position: absolute;
                              bottom: 0.533333rem; 
                              right: 0.533333rem; `;
              clearInterval(this.timer);
            }
          }, 1000);
        }
      }
    },
    getData() {
       if(Languge()=='zh'){
          this.language=true
        }else{
          this.languge=false
        }
        this.Rotate=rotate;
      $(".content").on("touchmove", function(e) {
        e.preventDefault();
      });
      if (localStorage.getItem("weixin") == 1) {
        //小程序
        this.noweixin = false;
        var ad = doc(".ad");
        if (ad) {
          ad.style.display = "none";
          ad.parentNode.removeChild(ad);
        }
      } else {
        if (localStorage.getItem("yyb") == 1) {
          //为应用宝
          var ad = doc(".ad");
          if (ad) {
            ad.style.display = "none";
            ad.parentNode.removeChild(ad);
          }
        } else {
          // this.adsenseContent = document.getElementById(
          //   "divadsensedisplaynone"
          // ).innerHTML;
        }
      }
      // this.$refs.ball.style.display = "none";
      this.screenFlag = 0;
      this.iosPic = ios;
      this.andPic = and;
      this.baseUrl = baseUrl;
      this.like_iddata = this.$route.query.id;
      this.like_gamedata = this.$route.query;
      if (this.like_gamedata.url) {
        if (this.like_gamedata.url.indexOf("http") == -1) {
          this.url = baseUrl + this.like_gamedata.url;
        } else {
          this.url = this.like_gamedata.url;
        }
      }
      console.log(this.url)
      function geteventdata() {
        var timer;
        var num = 1;
        return function(data, that) {
          if (timer) {
            // console.log('timer---------------------------')
            // console.log(++num)
            // console.log('timer---------------------------')
            clear(timer);
            timer = null;
          }
          timer = settime(() => {
            console.log("执行了");
            // var data = event.data;
            if (data.type == "miniProgram") {
              var ua = navigator.userAgent;
              var miniProgram = ua.match(/miniProgram/);
              console.log(
                "========================================================="
              );
              console.log(miniProgram);
              console.log(
                "========================================================="
              );
              if (miniProgram) {
                wx.miniProgram.navigateTo({
                  url: "/pages/ads/index"
                });
              }
            }
            if (data.type && data.position) {
              var param = {
                type: data.type,
                height: 150,
                width: 150,
                position: data.position
              };
              var pinjie;
              if (param.type != "banner") {
                pinjie = `?air=1&type=${param.type}`;
              } else {
                pinjie = `?air=1&type=${param.type}&position=${
                  param.position == "top" ? param.position : "bottom"
                }`;
              }
              // that.pinjieflag = true;
              that.pinjie = pinjie;
              if (window.webkit) {
                window.webkit.messageHandlers.girlBoxGame.postMessage(param);
              }
              if (window.girlBoxGame) {
                girlBoxGame.advertise(JSON.stringify(param));
              }
            }
          }, 3000);
        };
      }
      var getdata = geteventdata();
      //接收数据
      var that = this;
      // window.addEventListener('message',this.message)
      this.message = function(event) {
        var data = event.data;
        getdata(data, that);
      };
      window.addEventListener("message", this.message);
      window.addEventListener("resize", this.listenGame);
      this.getforyou();
      this.iframeOnload();
    },
    share() {}
  },
  destroyed() {
    window.removeEventListener("message", this.message);
    window.removeEventListener("resize", this.listenGame);
    // var str=`-10,100`
    //   localStorage.setItem('Inertia_ball',str)
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="stylus" scoped>
.content {
  overflow-y: hidden;
}

.iframe {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 0;
}

// 小球
.ball {
  z-index: 1000000000;
  position: fixed;
}

.ball span {
  position: absolute;
}

.ball {
  width: 1.333333rem; /* 50/37.5 */
  height: 1.333333rem;
  right: -0.4em;
  top: 1em;
  z-index: 100;
  background-clip: padding-box;
  text-decoration: none;
}

.ball span {
  width: 1.226667rem;
  /* 46/37.5 */
  height: 1.226667rem;
  /* 46/37.5 */
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjU2QkFGMkY5NDAzMTFFOUJGQUJEQjVDNENDNUE5QjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjU2QkFGMzA5NDAzMTFFOUJGQUJEQjVDNENDNUE5QjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNTZCQUYyRDk0MDMxMUU5QkZBQkRCNUM0Q0M1QTlCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTZCQUYyRTk0MDMxMUU5QkZBQkRCNUM0Q0M1QTlCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmSO3q4AACWuSURBVHja7H0HnFTV2ff/1umzfdllEZalCQqIYA1qIEhijF3zGrvoB5pYE0uMmmheG6KJkpioSeyRGIyvBQ0qqIAGCdjASl9dWLawbXb6Ld/znDvbZ2ZnKcr3fjn8zu4wO3PvPf/7nP9TznOeK9m2jf+0r6fJ/4Hg62tqx4vYxIsG/m1JAcwYpGSIjkSvYybsNoNuodT/VyUJ8WQcpmWK192ai3ol9Qrq46nvT30k9UHUC23TcituTXEX+SzbsuP0Xgv1BuqbqX9OfR31r1K9pcdgZRv1ERVtCRmanH1Gy/EEEqXFiFcOgWEBvmgYlbUbwFdqSQOTUddn/+gJ9jfcjqB+CPXDqU9PAZu+WQSSLDudbhS1cupjqR/d65MkAXib+tLUDXhtn5Hsb6AdRv1H1I+ifnDO37JIzIJ+ZyYlDZ4imT4ZoH5cqnPbQP1N6i9Qf+X/B7AJJZxJ/dIBAdyDuSTYBQUwkxGoJNmWkvMQRqX6bOrrqT9B/XHqNf/bFGSQ+g3Ut1D/064CzZIsuXRYeUEkJRWSbe3q9Yymflvqeu6lPuJ/C9jXpabwHdSLd/koRBd2LA65tBCy301gE+gySXV/pqtGnwlFYK//kq7iS1LgYZrPaveZ/VPqX1D/DXXf/6tgz6T+MfW51Et3+2jJJCS3G3JFKVkKcSR1NxIun6BuOxyDzUCur4a9rR5QFIfLuTe10bzyQrv/GshzrwI8btg7d9JnegydvoCrUxbNRXsLkD3L2bboHvo5n/rFe/TQ0RiUsSMg5QdhN4UEhcQC+dA310EmAJW5VwD0N2vxOzAXr4Q0rAwg8w0kydozd0L+1kHiOEXTj0B0xtWwSNplr7v3aVgo/kz9dOo/plmzZd+VbBnHCGm29yDQTB/tBExpEZSqIQR6XLwnkXI0bBlhU4c270ooPzsXykUnQVt4N+TpU2B/WSduvk3Wi5Qf6DycPq4SSl4+3Qgj2zm/JxnGJ5Jtn53F2vkGwTbtq6Erb0k+tYpeO1LeL5C5AS35vVAmjKFD0hcMo/PLUls7kuNGQzptRo+vKWccSzxN/oyuEW24kLzwVlhLVglJN2oaYDQ0Q9LUjOeUaRaZPq8nUV76FHld90n2vgX2H4WCYWXlVyAF2LO0HQdkF6WZj2UTmFKQePnQ8cTX5FgSCN0lTfa6YG2pRXz52p6Us+ZTIki3OIY0uJg+sw3xY8+C9dJyaMPL4J0+CcmWhrQ2uhyOwqJzRfYfyYCTd5y8kt5+nbpnXwB7EfVLOjmbAfaTWZavOW67kaOUd5N0O0IKjwYt71cO7bCJkFipRaLO8dipSSSdY5LkSsS7bdc+iMgT5CCajiloN5JUGyHHEkmQuVhWxB+G3Rxy7NBZx9GplM7Pi1PTMeVoFEZxPsIHjCHA3ULCUzeEp84H1Mv2DNiWnXvvMrdWUD++j5JkgN0ypAICw6c4b/J7pp3eVGMpJhvabo8KRSjn+aFOGkt9f9hkNQigGbhoAnZdM5mASZjbSDJNE0pZoVB2LbPupj7X0fq3zCFVR/y+jrz01hDsjzfRDCmBPG2K+Lt36nhog8qEGSiTOSkRvVheD2IjhyMyZiRsMnHkWKy35I9JAV6RUgbOWHLpfawRRc5d+gxSOoa5wpalqRINWLaMvpOEwxYsiWy56vS3OH2Hrk+yJXGd9JN+O12mwVn5Xhg0YBQESBJLCFxFKENWcMKUiyfFud03XwB5bCXkf6xA7C8vQynNJ4XnhT1pJBLPLkPizOnQjzsM2tuPIvnLh2B9+Blkcu+13/wM0sj9HAkroP+PGozwB5uRHDwIRsCPZGEBbLqhUiJB12nD0vUuq1PVYRoxvrkk2fZqKOpEyErDLpt+RnkwZz6V4sZiAnsqg2AldBgR3QkMpZFYid6XdYWhhUUWgBGOw4wkxYDayPVO0B1wE03kFRfAT6abi4EnpRinQbNC7JAta2MNtCt/CO2UY5zAx43DEKppRuMbH0KvKBLnj/ryIH38JUoIbGXUECgL/hsmmYlKYaCvrzN2GOQPN5DZ7YJqEtVsr4VlmGJi9qZykwREp+u0g/k0JLucpGO1rWlj6T/RXQLbdmn9GtESxxptPGT79O9arLVJ4Iyohqit0VjTKBviVJskPxGKIkndJKow+Rg0C0iG0KDZCEkGNOJLraYObnJI8mjwZWR9BOi3RVId55kjLA+a8u4uabOIb9ssCSHdA93lFdcX8flRdsDwnpZJGqDFtdHF2+07SPKJvnSVbrgOj98jeNyw7dRNdn7aPJO9NJbyfOdmWPYwmnJv0l05vH+TKg3YcluWm2Q7YU3bq19Or2cLGhEjlphOoLBk2FInZ0tESUwNiZY2xEiyjEhcXJNEM0FL3RRmcheBaZBdxcDz18NkO7e2t2M7cXRZwIvhBXnwaC7EmM+Hl8N4ZimkERVQjj+S+Ju4lhSptWMnDOLdZH0LCmdMQtHMSf0OOkKzoXXBP0VcTPneoYjTd0MbauBJ2vCT0Ol0jclulpStOFQnxtmhl5yo5V8khT1OCblYAVLHslhs/KysYBMmk42ywBor6GEa6YzAGTET8RDxnOyYaxJdFFNHtKGVgG5zbmQam5Y+hZ1yAmHJFGD3UAl0nCgB7KeZMbakCPlEM3GmoZ2t5JJ/BfWnZ0KfSw4eSWHj35YjtHo9FHLJy398PPSygqwDbl/0LmpOuBoJfIWhv7kfckkQxrZGmHS9dfc+Bvew4QjSrPXSOExW3Dx8UuyyS4Gr0N1lBEiOUBmhxIVWwnws24JJ4OPHeoE9IXtIQLKsegKzxCjLgxVwkyIxeoLNXK7K4nd4+07E28jro+kpZfDAMoHdHfSoYYqRHVhajJKADzFyaNRwBE3VTcDjv0LpiYcOSEHtuGshdtzwKzpfGGU33IziOy7GtuN/geD5M+GdMRkbi46DUlIGS5MRoGsPpAC3eoMNB+hkaxyJVl4swnAa5tZM5y3Y+nQv00/K2p+wVbnEpiOqta1k+JOcaUqPmcOSzRIdrm0SQCs0HaXdcHX50B46hyzJWFfXiCayu92KKmxuZWgpNl/+IFreWpfTsWKffolN067Hxhuugcs3HJVPPyKA5pb4vBquccMEt/tnTiUJryW9LyNEwhRmikzn+JBQJdsI6JaYeC1r8otC0DL0gTg1vJJyrhg9f5FOrtSFyLOynP93HIioIrazDfGWsAB6jwSfiDd1nspknXz4yUa0bK6BvHkbJKInNd+H6l8vQOvSDzN+P76pFjWXPYCPD/gv7HzrNQy/9FqM2rIA/h99R/y97cnXYDW3Qz/QUar5V5zMZCUsJZq0aCMqi5NeUbpRBINrRAwh0QRyh34cnwrV7nbU7+nu4mbTCZizlZ3tsCryO4FOhmOINrYJ6hhQkIl4N9HQAjNODg0c2rBTU4ZtFsXtg488wGSeDzsrSpE/fhSC0w7GhEPGYeuVD2H9jJ+gct5PUfKz04RNHl+/DbG1W9D06GtoenUJQRdByfGnoOyOC+CZ0NNSaX3on1AqukLsvuMOhXvkKCTJKlKK8oQOakuYKKTxyWL2yoK/WaKljhBuV+NFiEepN+8q2JdTH9J7fjOFyO3EVUQn7HwgaiJGrjDzv8wiYWd3iviiraZ2REI1iMsuFB0+AV5yVDQaoOB5UowqWSNaaQHcwwfDUzkYekm+s+6Yuuiae59D9K2P4A2WYvv1j6D1pX8LJyi8+nPEsIWc8zKUnnUKiq86Bd5DRveNm9EsDL+zAoOfvKu7PYjA2d9B/a0PkGTnCb2SpBsYIToJuljxE+20kLdJs1pIdd/2h9S66oDBZt/vroyBIk5BCBFnleTRtAoJyVbY6sgGNDs+PDVrq6GVlGPopf8HfjK9ClNudC4t9PxbSNz3HHZsaoWXo3rBAGQjhOblS0n63PCNOxDlZ1+A/NOPgmt0RcbjNN+9kKQ+gcDpPRflPUceQBBrTliCfQmJZcmEn2XIsMmvcAyDDI3XV3+VWuMcENhXcRghI5+yiRcjT5Dc6EQkLvg129HYJDRJ+pOttcg/62QUz50NbUjuCzjNb65B9W8WILRoMSrzhsLlKUGsZgP0/DK49h+CwiNnIu/UI+E7erywFLI2ktb6u+ej8JyzIXVzlLi5D90frqHDyPMkSiS9IBPgBlMdzVo9ZjgOjpJV8fPy2g8GAjZf7S+yh7DortOJbaKTJEmrnMXOZKCNxmaY7c0o++3PUXDV6blZEdW1aFq8ErWPv4IdK18hSYzR3a+C9e2DUDJiJJRBJ8B/7MHwTKzKKTGoozVe+whphxYU33ZB32Hl++E+bH+0LVwiwO6wjJhOmD5yaByYG0a9OlewL8wm1V1sQgqOXG2xGiJnkCaSMrO5jYBuQsXTdyLwo+mZ1x9CEbSt+Qwtyz5A27vrUP/qUoK3lvisEsPPvAj50ybDd0AVAt8aL1z4XVrjqG7Ett/chLILroU6LH0ukEKOERFGj3GapBhZwnNMhro53bJg1zJzz6l3fU6+Pn+HLJMk2aRqh1vf29ogpWW0bkfFn25PC3RoUw2al6xC40tvI/LJFrRtXY0kQgjK41B+8vEov4ik92Ca2oN3fWG+eyBy03GXwUU6v/TBK7LORJJjhxqFTrdojCZ9XxGTPodc1POoz0mdsi/YYeLflBd6EP0YBfTv7jN1JAhoD/1W0k1jWUGCeLXoukuQd/FxPRfL3/gAdc+8htqXliFWu4WuqpHUWyWGnno2ik86hvq3oebt2cyCxtn3I/LZUox59XVIWXwBiSRYo39KKsxA8Aq7W5GSQspzIBONPkYuuf1wWrDrWyPdKSSnZhB9+OmCSjwu4db2EnuYn2+B9q2p8M+d3aWbtu5A9PankPjzKzRRd6KQpMU7ehK8xx8B31kzoU4Zs1fSCOIPvgz7Tzdh9PX3wzPzoOwfbmiF2xuA6nU510zcodkG3HabkEY7HYXZfUzc0+hnerC7SeaM3F08SSxNWWK1yu7hult1ZNv7vfAtvKVL4f3+eURvewJG3eckLUF49p8A13kzybadSS74IOytFn/iNbRceiH851wL712zshsqrWEk122CRIqyI25k82qHzJFJRZi8di76wsY0OEmftZkU5GTq43JfVOO5xba12SciazZvR+DJOyGVF4o1w/Zz7kBs4Qt0DXFoQwnkOSfANfsHkIvzsDdbdN7TaLvuCnhPnw3/k7/s9/PJdVtgVNeL5bauKUwAk4loyxpkNv9yU5LMUxwXeCoT2EcMKHbBFojuXIDREWpXiD7WV8N17DS4zpkB66sGhI7/OeLr3iDCqITn0pPgufk8yOWFexVkTuRpnzMPkWd/D9+5V8P/xM25UePm7WQVtYnlNptAtuqbYQd99P8CWO3kuIn8QiXXyzgyG9hH5xzWIGk1C/NhBehCWlsBVji2szLOzf/ibbBbomiZOAtG8/twHfwDeOddAm36JOztxrQRnj0PRnwdAjfMg/eO3DPKrHZeRDFgtrSTnR2A78cnQSVKwf+8g4Skpg0HZ2mnpUIeZm+wWRt8L9cAkkx33cgLwNJdUMksEtqdleKmL+D/3Y3CM2sa8n0C+hP4Lrsevt/+pDO2sbdacsl7iN75NGJv/I1kbwTyFy6EfvpRAzpGgMD1X3ScWOk361oQ+5gspYcXwdXcilBZEVzJMBQjCUvOaSylKQdnc2+w+c1ATlgnSao506i4CGhphcxhSBENa4M2cSJcZ89A6yEXwdz5OfIeexiu87+7V0FOPLcC8UcXI7boOZpc5GWeNAveP1wFeXDRwGbEsrWIvPQOXFPHi3SJ6D9XIbRwGYoDbijkAHHWbNzth6+tUZi1ObYR6cDebyAUEq8qh+VxQ2pscrQBue6Jtghct1+E8BXzkVizDAVLn4c6fcJeAdj4tBrRl9+F+dTrSK7lhCU3XIfPgPvaM6GfetQuHbP96SVofvgBaPdWCk/RDPoR4AwqXUY8aULWDUS9QeixMLRkDKai57L2yMtJr/cG+8Cc6CMcgVFciGT5IJFj4ViA9D652t5DxyKx7CMknn4eBcsI6KMP3CPA8nDMTdsgb62F9cYaxN/6CC3/3gjTaIWnohLecy+Bfs6x0GZO2a3zSD43mRBDoY8dSj6EDRfRc0CVHU9SFmuIYtNWOFCM/OZtIl8mBzo5JJ2CPKC/bykR4jFSiNGqYWLJv3vs3OLVZ17lfuYtBF+4f7eBZs6MvfU+Ih8SqEvfg2/tBshN9XwmYMpk0gOnwD3tIOikcGW/Z4/cVBc5VO1AZypDgViW65GlBtlMwtDdCOWVItBSR4CjP8Ar0oFdlTl2TZwcjcEIBhAdMyKVnhWnmevqFpskL3LNGqEc5ROP3OUBx94kgF98G9HXVyPyySqSNBvFeVVwTT8Y9owpUA6ogvytCXtF2Xp4ZgwqEgn0hYMLyWu0RdZcb7NaMRKCuyVyEXyt9XQDjGx7e/zpwC5P67dwzhudNF5eivjQIWIBQADdXazpRHbNRignHgf5spN3aaDhBUvQ/sRiRBavRBJb4AoeiILTfoiCH06DMnl/UjMVe91kZAer6NbzYV1yO7TiIEmw5uT0pZvlZJHEPH6YJNX+UCOUZFwoULtv9DMt2Hkd4SyJQ6ZJJ8TISiJRVkqWR6F4T4r3AppftzRBCpZCe+SaAQ8w8vwKtM5fiOib75ExWg/PiEkoOO9i+MmFV78GgPssT5Fna35Vh/jtj0EeWUmk7REeZCbAebtJa8FgeCKtcMXaoZLUcyzF5owrBx93H7BJB7j5rog7w/ayzycSDo38vE7aEMmQ3aaLwbl+IoxaC23e7ZCKgjkPyiQl1/TbZ9D22kphs+t0LO+si5H3ywuhDCnFN9mU2y6GnkdCduOfoZTkQ+bkTRJAlTrHSboyEG2xPZCBjfvyYeoeaIkoNCtBpnBS/J2UqtoH7KCuKpaqwiJnxPK6CWgfbHbFoyFHytM4TmZShXdHHTD5cCg/OSk3xVffgsicexF7/nUonjyUDimH/VU93Pf8GPplp2JfaSqZkBgxGG2XzYe8MwRzWBmaNUdIpT4BbWe90grmcSIEFLLY1EgEcoS3mifl/XqD7VFki/epgD6IcBho2CmSLU0yhyyXLqhFqOVuoNsxOnBrC+S7Z+Wm/P7wAsI/uYO8zXxop34X2ntfQK2uh/qHqyFdfDz2taaeejS8VQT4ObcjHkkgVFqQFmzbpYpcE4lcfKmVsOPcRqtjLUW3O8DuZHPTtkUGn8ELnMQ5hk13KkzUQXcVrRHxXpJAN2jKdHRe6LWqKiCfkN2JcIJRN6D1J3OgjBqFgpq/E+A+JKs/gXTlafsk0J1G1kEjUcDx+OodIrWYaUN0fk2IqroCnQDWN9bAtaUWejN50aYJTbKgyzZ1q3N9rbvqDPUOn3JyODssCm9vq2sWK+ki7cwJjsOua4J6IgHt0jPHK15bg9bJsxF95XG4J5+E/PVPCZ0QX/BXKPtPgjp3DvblZtOY4zQGXgju2odiizEwPjLhIm/aDikUFUzA1Ntr8TmezhrZAWebcR87W2TksxIjvk2WEC95iFbIfWWq0o8anzlm8exytJ/xK7IyasgBORPBV+c5Fsgv/kIysQPatXelT6LfB1ri9feQrN2J2DNvwvpgPeRRQ7syg3knBDtxNY2QeJGEs8DE7te0rns4Hdhbs4VYWaI5GV5raEWStLPJCexjhkA/eFRGiQ6dcSOB2gTXtBMQXHJv5x1Pvrwa2pBjoJ07c58EOnLdQ4jM+wOZvfvBriiGXlUu3PdOU5clensjSXWTWFTo2N2WKeSSjkY+6y9AYacSKdWdbbAaWqAdPk5snetjpWzchtCJKaAP/zaCr9/TCbT5yVYkv/wQrjOmQ9KUfRJsY9VnJMQy3GWFUPJ8gkqdzUgQuxQ4sVPaQUC7dOSwKbUuHdhrc4kIMeBMIUp9K+SK9OkF4fPvgRnfBH30ZAReu6fH5qjk4tV0mBDUb0/YZ3naextvJsiHTTSiEhd3pB1wXiPrLZneF7Sh5LSQ8EE6sKtzDcEx4EoyBtXfN48n/sdFiP9rEUnEaAQWz4UU6BkkMj/dStgPh3bMxH0WbJX0UHDZfPIevYKTlXDM4WnevsJ7LHnnWq/89CxtZSawk7kBzts5dKi9gvMcqYvc+mcRWw4suBXy8L7hFpPMI6ViMKRMOSGmtU8ArhHgvDuYKz6wc2IzDcYSZEdHnD2ZuW9e3pAObCbyN3MjNZMk1teHRuIPvYxE3XL4r78K2nGHpL1JFplJ8uAs+154DTAa/+ZMPTp/cun7aD/rNpgbvhLZAbylReaQMv2NN6jmvGfUsUS2pLNGuC2BUyck+wXxTl2Xswm/C+kkor99GlrZVHjuSr/AarFi3b4TyviqLITJ+9F3OBuhqsq/VqDDl89HYuFbsFvCQqBk8h5FfIMTR1kATBUDrNLwQiY7m9uanNdOep2UF1uT21ai4MXnM3+NPC3biKa1YLrmL5lVQ0pgvfspLHLn5SljIA3/ekC3ycIw6zZDrTogVV0ttRee9wuRMEnsWigDSulc3kMXdHmMwgx7C049vKzrkZJKnmWE6D3ZFXqM3Pc8SfW3oJ1wWH+3KV3Mt490y9MnwVqxFubf3nD28Rw7BdLk0Xs3vPrYz2Gs3QKbhEIKersESqNZzImVprNrQsod7jfSg52Md2DBVJI938+2YLc1w6pvEok3dnM7zCWL4bv3xqxf45QuRXWRaxvKLZh/1ATIU8fDeJgsHOrhxnrSBUciePGJewVsXoOUgm5YNXViR2+XgNjE2SY8ksvZptJNO2bRk+92V449wW7d2fFqAXJIrrQT1bC+IKdz+sGwXv0XPKiHPmV49sEUBeEdHoDUUDsABCSoc04QF2q+uBzhVR8jft5NKBgzFMrZP4BUOXi3QTY/I0dr2UqYqzbB+vRTyGRpdcOD2IT8Cs2F0rwix2PPrX7tS31MyjQf4mV3XlnNHMEXs8iEVdvoXOwTiyB5hkAa338GqjyuCibRg/DIBrhP0n3EQQivq0H0hRfhb1sAc96zkMiLVc75HuRjD4E0qGjgPN0SQmjKLBiRdTSsIigF+/Xga2eAZH35VOHx2qI6RE7X/cc+Y+8uQd36/F7/79kF2sTbCSd6aK14D/LRh4nyFf0K6uhhsJrWwVr+/oBAafzlo9hQ+l3U3/RbWP4g5KEHE49aMF9dhsS51yM+/lwkL78H1tLVA3TNP4EZqYEamAilcGhXnKPbeEWZDg6+ccauldpinb0vot5s96KZTJrq/n4llNxZ89PNMP6+lGzTBgIxtxwfeSrnRidgvbIyZ0Ba7nsOdf89F2p+CVxDRsJmZ4pzCLzEsWVDSaKHkQ6JIfn7RxGf8WPEv3MZzMdezo1CVn8qrge6knkW88IAn4u9xtxKMd2SduxZIlUPZp/Tfpjvf4HEI69AchVnzeTvccLvT4VSfgSMp8gEbWvvP9S5vgZ1V8+HKzgCCq8aKSpJtoesAislRnan8pXLR5FeKIX1xjtIXHgD4gedC/ORl7JL9tsfCY83Y9SOPVo3KfXiAsdg659CeMq+NxCwud2aUdmKXBKyO/OCEHlabm/ucWmOA//XDBjbVyDy+//p9+Ohp5aQdmiGXJgPKRaHkR+E6fHQ6SxH43S/QuZZdobKh0EqrYT10edIXPRzxI+YA+PB54m6PoS9vZFMu3Yh0dGb/4jkm6ugBCoyKmdRJTOflHqALCkuhcG8bWaV7oybdbLtg+TFhPvgVHLsFW1K0LSiAbMlwCvOqka2c+7bqJU5p0Cb/wga7v0r1NknQy/OwPU0ZcOLV0FVi4WbbJN9nywtgmZwIIjsXRenKDPAvaTNctZKpbLBYi3Qenct9XfprQCSXPKCKWNbPf2pmYAeQsKiCyXY9/yW4BG5YlBnhR3VqyLeEs+0F/Jf1N/JOKv7wYV3jfWp+mLHEgR0Bd1tr9iax16f3Z7I3Zrbfzj0s09DvGkV6n/6p8x82tCC5JcNkH1+URKU81c4j4ULiYtp702FOTPxqFB0xLeDSgSvS8X5QqpFCVGfhxRipRNUSgd0R/HGcvpuWbGI17ByVP0aFJciNp+m8W2ymsz9gc1RwEt6XACX1RxcCoXARkf1SJpm1ofriekjuQN+w3nQMRLNTz6ByOI1GXwni6SX3PdIROSvJIaUOYEgobQgJFoKqM5rOzcK41CBVBAU1Yqz2fZccU3iG0KCIXibM6Ms5296gdtZgzV6nPQBZNhGnSvY3LjO9Nti8CFyY8m8UyeOcuijo3okubb259VirS7nNnYEPFfOIox2YvvZvxaFA/rQDZ1LI7owiT6iIyudAl3ds5N4sB6iE7+KnKtk5uBECSEiHcTl7tgKQbd0O5ZoRRR68Tgl8pxZxR7QZf0aB13UEM/co/FTuAaeVJQP9ZADRUnkjpqoHdfHP8xX/z2gcRXcci58eZMQJbt728k3ph03byWJjB4BixOGeqe+Ca5JVcnsANyydwtopg4GWqNxSnRuDrn2Pidvq1Z9GlxFHnGD6f+ncimPTL0P2FxYNmMvzm8kZXiGevA4EZQR+2a6L9czNVaUwPjra2IpKWdFSeZa+T9uhUbOauuKRdhxwdyeNEJSFN2vgkw9b99kzu7BCQY4QIDnpUKgxi5IORf9IlNUJopRD59AglUAmxOWMlh6DuA6lzK6XXGryxUPcXmG3scaUSZkj6hJsvws0cbvEI1dnnbQPN1qGpC87THoD/ws5zF6vzMJFU/PRc1Z16Hx8fuhEiUVz7/cYQlRA5CUsai6KGUPJZqOwpSIduywKYo2OmUsOrzjNMqTJY9T61g30PUrY6scXaRwGbpwvza1lTTfIaBvUjy5rdyo3e9sf6FRusAr6AIm2op8tNjRTQpHlRJwmUlR7geVJbAeXwRMIy/x9O/kDHjgR9/GUO0ebJ11Bz7/3bMYPGoEqi7/PlAYQCzqmJlMI8LJ0d0wEs4mIklki0o91TlbJ5xPoxOfcpVMMxUQFavjkkij4wRJDhNbvC+IZirTI1scwrpi2mQl3D3/m72ZvqnDHD+aYQ+AttSewaX+OI1Zxz5WicY/I6mo4hp9cRpAs6/QCTuyYzNChXHNX1A8uqpPmaCsseTTj0blxDFwnT8XkSuuRSgZgfvIA1C4o154jh1LUZyOq5NDFQ4WwU534aIGIdnGeU7lNZNulkGzg6tlSkQv7XQzkqoLmtcLL1FGHjlmGoNOOihZtxOpGGofLpc68xzFD7Zzp1KPDUgldIQLo0ddmpum5tJECaOIpt5al2UMrvcGsSk4CLqZqvVHHlayphE62bejF1wP35gB5lg3tyF+3h0ILXqWHA4CvzSvM+AlhIyskSSBHyFHo1cRXocOU5v7E2SicnUfk4vkpqwmLkNUryQQlk2onEFG3w8QZQRp1gzy++DVdTK5DVFbpOcCgROY6rboMSWTS542srHy4Z5gxw/LoZh7Kn8iddIK3TLeb3L5Sr/yFkKzzE7JkkhS4rVNkBtaMfyei5B3+tQBGwbRe/6OyHUPspaEMmpYZxyEJcxyazA4F9zuUoS8X15WncJgXLwxyeXwWDA4zyUFUu9agvz3BJcDJXA9dJPKySUfRj6DQrOHizhmoGzOGlsxoNBwCuwu0y+VCJ+1K3L3u7uNOm/X3dhjCov6q3Tx9FrZ0YQtZ9yC2l88NmCwPdf8EHkfPwpt+iEwN6yHzdUv0+2j6VaONNrYitBX9Ui0x0QMQ+HspSwxG6YZLrTLlTEtut5NTS14f3s92hMJePQ+gTX2pI8cKNADdWqyte0pwJcLoHkKc028zbWQtjdC268E+uAy1N75GDYecy0iqz4f0MHVccMQXHovfPddJ3jY/GKTs+7ZkUog8lfkzuKNkfoWUe9V0Qf23AynZCFXqdQQIuX4HgHeHI3CzWau85EvU+NcuTtg7YkUUnb9jiEA/sSDV6rrREVgm6hEuNv02zNqJNqXfyQA33blg0h+NbDS0+4rT0Pe6gfhOvO7MLdtg7VhmwCcgZXpd4RmEBfYVbhSvLx7VTK5ohovD6zd0YBmctldisLPJuNcuS92F6g9lq9ra+ps4ug5Etf3615RLGXPukcPI/c7iPr5C7H+0KuIWh5F7N+5S7pcWQb/gpsR+MedUCaNgvHhJpHhH2uNINbcTi60DuyBB28wj7uJWlhJbm1pu53NO6Kb1j2B0Z5Njjath2m6j08XZuRyErKPpXy4eL3jzidRfczVqCU3veX+52B8WZ/TKbRTj0L+uw+g6Llfwy7JR3hjjeBr7LknnLB8VBOtfI8myU3WHnw46Z59KJAs1uw+Ttmg16QWILzd5ykrTy6/rOSPgNLWjNALb6L1hSXQ714AbcRg6AdUwnPEgdBHV5Ct7BM0JKUUo0UWgkLSzI8ykfxuJEQwzOy/jt/A2vxUaDkm7cFn1Ox5sHu2e+CkRfBUPD9dYJ6X0rQhQ8ixk8VDIqIrPkZ4xb/R/OA/iH994hli4okdKYvCIGC9pMCC9L0Q3bRILAGVV9RNc09cL1cvv3kg9vO+BHaHeXgBnBqlvOJzZtoAPyfB+D3OHvTUAitLLFsevFBhd0v6j/MWOLax+QaQqbcHgOZkUi5a+/JexuJre0Qhx165ICzz+cOp+G8Wx0kST0iSOA2Nb0LA6QrfDKKVhGkLN3w36IPTv54XVpTzZNWXvw4Qvu7dQ8znvD2sEk45Hx6wMVC9EOfnyhjGrhRDX5qiCg7anIJeiY97u31Tj5Vl2/z3qc4JJ9NS3tnMFBDpo45wauqxiy2UZP8mCJs4r6aso3dSN/sba/vCA5M5a/aJVOc2KiX5HOzhJ6JWEKQFsiRxnrGH8OUYkmw7DwAxyC7myBsnnbMtzJuFeG/Q6lQYYeNAI3N7s0n/ecj919f+85D7r7H9XwEGAJqBf8/w2m+9AAAAAElFTkSuQmCC');
  background-size: 100% 100%;
  z-index: 99;
}

.ball.ball_right span {
  right: 0rem;
  /* 10/37.5 */
  bottom: 0;
}

.ball.ball_left span {
  left: 0rem;
  bottom: 0;
}

.img {
  width: 1.226667rem;
  /* 46/37.5 */
  height: 1.226667rem;
  /* 46/37.5 */
}

.tishi {
  width: 7.946667rem;
  /* 298/37.5 */
  /* 221/37.5 */
  overflow-y: hidden;
  border-radius: 9%;
  background: pink;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fffefe;
  z-index: 999;
  display: none;
}

.tishi .top {
  height: 1.2rem;
  /* 45/37.5 */
  background: #ee436d;
  text-align: center;
  font-size: 0.4rem;
  /* 15/37.5 */
  color: white;
  line-height: 1.2rem;
  /* 45/37.5 */
  padding: 0 0.4rem;
}

.tishi .top img {
  width: 0.586667rem;
  /* 22/37.5 */
  height: 0.586667rem;
  /* 22/37.5 */
  float: right;
  margin-top: 0.32rem;
  /* 12/37.5 */
}

.tishi .middle {
  /* 130/37.5 */
  box-sizing: border-box;
  padding: 0.293333rem 0.426667rem 0.2rem 0.426667rem;
}

.screentishi .middle {
  border: 0;
}

.tishi .middle p {
  font-size: 0.533333rem;
  /* 20/37.5 */
  text-align: center;
  padding: 0.266667rem 0 0.533333rem 0;
}

.tishi .middle .img_two {
  width: 1.306667rem;
  /* 49/37.5 */
  height: 1.306667rem;
  /* 49/37.5 */
  margin-right: 0.613333rem;
  /* 23/37.5 */
  margin-bottom: 0.24rem;
  /* 9/37.5 */
  float: left;
  position: relative;
}

.tishi .middle .img_two:nth-child(4n) {
  margin-right: 0;
}

.cc_home_img {
  width: 1.306667rem;
  /* 49/37.5 */
  height: 1.306667rem;
  /* 49/37.5 */
  border-radius: 12%;
}

.type_img {
  position: absolute;
  top: 0;
  left: 0;
  /* 1/37.5 */
}

.tishi .middle img:nth-of-type(4n) {
  margin-right: 0;
}

.tishi .bottom {
  height: 1.173333rem;
  /* 44/37.5 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 0.026667rem solid #ee436d;
}

.tishi .bottom img {
  width: 0.693333rem;
  /* 26/37.5 */
  height: 0.666667rem;
  /* 25/37.5 */
}

.fullSlotContainer {
  background: red;
}
.screentishi {
    width: 5.946667rem;
    /* 298/37.5 */
    /* 221/37.5 */
    border-radius: 20px;
    background: pink;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fffefe;
    // z-index: 10;
    display: block;
  }
    .screentishi .top {
    height: 1.2rem;
    /* 45/37.5 */
    background: #ee436d;
    text-align: center;
    font-size: 0.4rem;
    /* 15/37.5 */
    color: white;
    line-height: 1.2rem;
    /* 45/37.5 */
    padding: 0 0.4rem;
  }
    .screentishi .middle {
    // overflow: hidden;
    /* 130/37.5 */
    font-size .533333rem /* 20/37.5 */
    text-align center
    box-sizing: border-box;
    padding: 0.293333rem 0.426667rem 0.2rem 0.426667rem;
  }
  .screentishi .middle img{
    width 2.133333rem /* 80/37.5 */
  }

</style>