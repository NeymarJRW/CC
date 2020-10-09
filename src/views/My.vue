<template>
  <div>
    <div class="content">
      <!-- 玩过 -->
      <div
        v-if="loading == false"
        style="height:100%;"
        class="display-flex justify-content align-items"
      >
        <cell>
          <spinner :size="index === 3 ? '40px' : ''"></spinner>
        </cell>
      </div>
      <div v-if="my.played ? my.played.length : null ">
        <p @click="xiala">
          <img src="../images/my/played.png" alt @click.stop/>
          <template v-if="this.$store.state.Langugeflag == false">MY LAST PLAYED GAMES</template>
          <template v-if="this.$store.state.Langugeflag == true">我玩过的游戏</template>
          <img
            src="../images/my/jiantou.png"
            alt
            
            v-show="played_show ? true :false "
          />
        </p>
        <div v-for="item in my.played" class="img_two" @click="togame(item)">
          <img v-if="item.type==0" :src="baseUrl+item.thumbnail" class="cc_home_img" alt />
          <img
            v-if="item.type==1||item.type==2"
            class="cc_home_img type_img"
            :src="item.type==1 ? iosPic : (item.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(item.url)"
          />
        </div>
      </div>

      <!-- 喜欢 -->
      <div v-if="my.like ? my.like.length : null">
        <p @click="xiala" style="display:block;width:100%">
          <img src="../images/my/like.png" alt @click.stop/>
          <template v-if="this.$store.state.Langugeflag == false">FAVORITE GAMES</template>
          <template v-if="this.$store.state.Langugeflag == true">喜欢的游戏</template>
          <img src="../images/my/jiantou.png" alt  v-show="like_show ? true :false" />
        </p>
        <div v-for="item in my.like" class="img_two" @click="togame(item)">
          <img v-if="item.type==0" :src="baseUrl+item.thumbnail" class="cc_home_img" alt />
          <img
            v-if="item.type==1||item.type==2"
            class="cc_home_img type_img"
            :src="item.type==1 ? iosPic : (item.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(item.url)"
          />
        </div>
      </div>

      <!-- 推荐 -->
      <div v-if="my.foryou">
        <p @click="xiala">
          <img src="../images/my/tuijian.png" alt  @click.stop/>
          <template v-if="this.$store.state.Langugeflag == false">FOR YOU</template>
          <template v-if="this.$store.state.Langugeflag == true">猜你喜欢</template>
          <img src="../images/my/jiantou.png" alt  v-show="foryou_show ? true :false" />
        </p>
        <div v-for="item in my.foryou" class="img_two" @click="togame(item)">
          <img v-if="item.type==0" :src="baseUrl+item.thumbnail" class="cc_home_img" alt />
          <img
            v-if="item.type==1||item.type==2"
            class="cc_home_img type_img"
            :src="item.type==1 ? iosPic : (item.type==2 ? andPic : '' )"
            alt
            @click="sendUrl(item.url)"
          />
        </div>
      </div>

      <!-- <div class="slectlanguage" ref="slectlanguage">
        <p @click="languagexiala">
          <img src="../images/my/tuijian.png" alt @click.stop />
          <template v-if="this.$store.state.Langugeflag == false">LANGUAGE</template>
          <template v-if="this.$store.state.Langugeflag == true">切换语言</template>
          <img src="../images/my/jiantou.png" alt />
        </p>
        <div class="languagexiala">
           <p  @click="selectlanguage" :style="{color:zncolor}"> 中文 {{$store.state.Langugeflag ? '&#10003': '' }} </p>
           <p  @click="selectlanguage" :style="{color:encolor}">English {{!$store.state.Langugeflag ? '&#10003': '' }} </p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { cbottom, ebottom, ios, and } from "../api/img.js";
import {
  getHome,
  saveGame,
  clickNum,
  returnGame,
  Ua,
  baseUrl,
  foryuCache,
  Languge,
  regain
} from "../api/index.js";
import { Spinner, Group, Cell } from "vux";
export default {
  components: {
    Spinner,
    Cell,
    Group
  },
  data() {
    return {
      my: {
        foryou: [],
        played: [],
        like: []
      },
      baseUrl: "",
      played_show: false,
      like_show: false,
      foryou_show: false,
      xiala_flag: true, //未下拉,
      tuijian_id: [],
      liulan: [],
      liulan_id: [],
      random_num: [], //获取随机数
      iosPic: "",
      andPic: "",
      nameFlag: true, //中文为true 英文为false,
      loading: true, //加载的loading,
      selectlist: [{ name: "中文" }, { name: "English" }],
      zncolor:'',
      encolor:''
    };
  },
  watch: {
    $route(to, from) {
      if (to.path === "/my") {
        this.getData();
        //获取时间对应的字符串
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        String(curr_month).length < 2
          ? (curr_month = "0" + curr_month)
          : curr_month;
        String(curr_date).length < 2
          ? (curr_date = "0" + curr_date)
          : curr_date;
        var yyyyMMdd = curr_year + "" + curr_month + "" + curr_date;
        //如果没有存过时间的字符串，进行存储，并进行重新赋值
        if (localStorage.getItem("data") == "") {
          localStorage.setItem("data", yyyyMMdd);
          this.regaindata();
          this.loading = true;
        } else {
          //如果已经进行存储，进行相减，大于一，重新存储，并赋值
          if (yyyyMMdd - localStorage.getItem("data") >= 1) {
            localStorage.setItem("data", yyyyMMdd);
            this.regaindata();
            this.loading = true;
            // alert("数据更新")
          } else {
            //alert("最新")小于一不变化
            // alert("已经是最新了")
          }
        }
      }
    }
  },
  methods: {
    //当为安卓或ios时
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
      location.hash = `#/my?air=1&openappstore=${gameurl}`;
    },
    //列表下拉展开
    xiala: function(e) {
      var e = e || window.event;
      var target = e.target || e.srcElement;
      if(target.childNodes.length>0){
      var oDiv = target.parentNode;
      var oImg = target.childNodes[target.childNodes.length-1];
      }else{
      var oDiv = target.parentNode.parentNode;
      var oImg = target
      }
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      if (this.xiala_flag) {
        oImg.style.transform = "rotate(270deg) scale(0.8, 1.5)";
        oDiv.style.height = "100%";
        this.xiala_flag = false;
      } else {
        oImg.style.transform = "rotate(90deg) scale(0.8, 1.5)";
        if (w > h) {
          //横屏
          oDiv.style.height = "3.786667rem";
        } else {
          oDiv.style.height = "3.946667rem";
        }
        this.xiala_flag = true;
      }
    },
    languagexiala: function(e) {
      var e = e || window.event;
      var target = e.target || e.srcElement;
      if(target.childNodes.length>0){
      var oDiv = target.parentNode;
      var oImg = target.childNodes[target.childNodes.length-1];
      }else{
      var oDiv = target.parentNode.parentNode;
      var oImg = target
      }

      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      if (this.xiala_flag) {
        oImg.style.transform = "rotate(270deg) scale(0.8, 1.5)";
        oDiv.style.height = "100%";
        this.xiala_flag = false;
      } else {
        oImg.style.transform = "rotate(90deg) scale(0.8, 1.5)";
        if (w > h) {
          //横屏
          oDiv.style.height = "1.4rem";
        } else {
          oDiv.style.height = "1.33rem";
        }
        this.xiala_flag = true;
      }
    },
    selectlanguage:function(e){
      var target = e.target || e.srcElement;
      if(target.innerHTML.indexOf('English')>-1){
         this.zncolor='#dcdcdc'
        this.encolor='#f79ebe'
        this.$store.state.Langugeflag=false
        localStorage.setItem('language','en')
      }else{
        this.zncolor='#f79ebe'
        this.encolor='#dcdcdc'
        this.$store.state.Langugeflag=true
        localStorage.setItem('language','zn')
      }
    },

    //拼接数据往后传获取新的数据
    regaindata: function() {
      localForage.getItem("like_id").then(res => {
        regain({ id: res.toString() }).then(res => {
          let arrcon = [];
          let obj = res.msg;
          let arrid = [];
          Object.keys(obj).forEach(function(key) {
            console.log(key, obj[key]);
            arrcon.push(obj[key]);
            arrid.push(key);
          });
          localForage.setItem("like", arrcon);
          localForage.setItem("like_id", arrid);
        });
      });
      localForage.getItem("liulan_id").then(res => {
        regain({ id: res.toString() }).then(res => {
          let arrcon = [];
          let obj = res.msg;
          let arrid = [];
          Object.keys(obj).forEach(function(key) {
            console.log(key, obj[key]);
            arrcon.push(obj[key]);
            arrid.push(key);
          });
          localForage.setItem("liulan_data", arrcon);
          localForage.setItem("liulan_id", arrid);
        });
      });
      this.loading = false;
    },
    //游戏跳转
    togame: function(item) {
      localStorage.setItem("fromPath", "/my");
      localStorage.setItem("msgplay", item.id);
      localStorage.setItem("url", baseUrl + item.url);
      localStorage.setItem("gameLabel", item.gameLabel[0].id);
      saveGame(this.liulan, this.liulan_id, item, item.id);
      clickNum({ id: item.id }).then(res => {
        if (res.state == 0) {
          alert("游戏获取失败,此游戏更新中");
          this.my.played.remove(item.id);
        } else {
          //alert("游戏获取")
          var direction;
          if (item.screen == 1) {
            direction = "land";
          } else {
            direction = "port";
          }
          if (window.girlBoxGame) {
            girlBoxGame.direction(direction);
          }
          // location.hash=`#/my?air=1&direction=${direction}`
          var w = docEl.clientWidth;
          var h = docEl.clientHeight;
          localStorage.setItem("screenWidth", w);
          localStorage.setItem("screenHidth", h);
          item.air = 1;
          item.direction = direction;
          localStorage.setItem("screen", item.screen); //存取屏幕横屏或竖屏
          this.$router.push({ name: "game", query: item });
          if (window.webkit.messageHandlers.girlBoxGame) {
            window.webkit.messageHandlers.girlBoxGame.postMessage(direction);
          }
        }
      });
      //传横竖屏
    },
    getData: function() {
      if(this.$store.state.Langugeflag){
        this.zncolor='#f79ebe'
        this.encolor='#dcdcdc'
      }else{
        this.zncolor='#dcdcdc'
        this.encolor='#f79ebe'
      }
      this.tuijian_id = [];
      this.iosPic = ios;
      this.andPic = and;
      this.baseUrl = baseUrl;
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      //判断横竖平时列表是否下拉
      var show = item => {
        var w = docEl.clientWidth;
        var h = docEl.clientHeight;
        var flag = false;
        if (w > h) {
          if (item.length > 7) {
            flag = true;
          }
        } else {
          if (item.length > 4) {
            flag = true;
          }
        }
        return flag;
      };
      window.addEventListener("resize", () => {
        this.like_show = false;
        this.foryou_show = false;
        this.played_show = false;
        this.played_show = show(this.my.played);
        this.foryou_show = show(this.my.foryou);
        this.like_show = show(this.my.like);
      });
      //获取浏览和收藏数据
      localForage.getItem("liulan_data").then(liulan_data => {
        //获取用户浏览的gameLabel的游戏id
        if (liulan_data) {
          this.my.played = liulan_data;
          this.played_show = show(this.my.played);
          var str;
          var liulan_data_len;
          liulan_data.length > 3
            ? (liulan_data_len = 3)
            : (liulan_data_len = liulan_data.length);
          var random_num = []; //获取随机数
          for (var i = 0; i < liulan_data_len; i++) {
            let num = Math.floor(Math.random() * liulan_data.length);
            if (random_num.indexOf(num) == -1) {
              random_num.push(num);
            } else {
              i--;
            }
          }
          for (var j = 0; j < liulan_data_len; j++) {
            let len = liulan_data[random_num[j]].gameLabel.length;
            if (len > 0) {
              this.tuijian_id.push(
                liulan_data[random_num[j]].gameLabel[
                  Math.floor(Math.random() * len)
                ].id
              );
            }
          }
          var str = this.tuijian_id.join(",");
        }
        // 根据返回的便签推荐游戏
        localForage.getItem("foryou").then(data => {
          this.my.foryou = data;
          returnGame({ glId: str || "1" }).then(res => {
            // log(res)

            if (this.my.played.length > 0) {
              var filter_id = [];
              for (var i = 0; i < this.my.played.length; i++) {
                filter_id.push(this.my.played[i].id);
              }
              for (var i = 0; i < this.my.like.length; i++) {
                if (filter_id.indexOf(this.my.like[i].id) == -1) {
                  filter_id.push(this.my.like[i].id);
                }
              }
              var foryou_arr = res.msg;
              var newarr = foryou_arr.filter(item => {
                if (filter_id.indexOf(item.id) == -1) {
                  return item;
                }
              });
              this.my.foryou = newarr;
              if (newarr.length == 0) {
                getHome({ page: 0, type: Ua }).then(res => {
                  log(res.msg);
                  var arr = [];
                  for (var key in res.msg) {
                    arr.push(res.msg[key]);
                  }
                  arr[0].splice(4);
                  this.my.foryou = arr[0];
                });
              }
              this.foryou_show = show(this.my.foryou);
              localForage.setItem("foryou", newarr); //存浏览游戏数据
            } else {
              this.my.foryou = res.msg;
              this.foryou_show = show(this.my.foryou);
              localForage.setItem("foryou", res.msg); //存浏览游戏数据
            }
            if (res.state == 0) {
              getHome({ page: 0, type: Ua }).then(res => {
                log(res.msg);
                var arr = [];
                for (var key in res.msg) {
                  arr.push(res.msg[key]);
                }
                arr[0].splice(4);
                this.my.foryou = arr[0];
              });
            }
          });
        });

        localForage.getItem("like").then(data => {
          if (data) {
            this.my.like = data;
            this.like_show = show(this.my.like);
            //存取喜欢和玩过的id
          }
        });
      });
      if (Languge() != "zh") {
        this.nameFlag = false;
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="stylus" scoped>
 // 竖屏
@media all and (orientation: portrait) {
  .content>div {
    height: 3.946667rem;
    padding: 0 0.32rem; /* 12/37.5 */
    border-bottom: 0.32rem /* 10/37.5 */ solid white;
    overflow: hidden;
    position: relative;
  }

  .content div p {
    font-size: 0.346667rem; /* 13/37.5 */
    margin-bottom: 0.4rem; /* 15/37.5 */
    margin-top: 0.346667rem; /* 13/37.5 */
    color: #f79ebe;
    font-weight: bold;
  }

  .chinese {
    font-size: 0.346667rem; /* 13/37.5 */
    margin-bottom: 0.4rem; /* 15/37.5 */
    margin-top: 0.346667rem; /* 13/37.5 */
    color: #f79ebe;
    font-weight: bold;
    width: 50%;
  }

  .content div p img:last-child {
    float: right;
    transform: rotate(90deg) scale(0.8, 1.5);
  }

  .content div p img {
    width: 0.426667rem; /* 16/37.5 */
    height: 0.426667rem; /* 16/37.5 */
    margin-top: 0.04rem; /* 1.5/37.5 */
    vertical-align: top;
  }

  .content div .img_two {
    float: left;
    width: 2.186667rem; /* 82/37.5 */
    height: 2.186667rem; /* 82/37.5 */
    margin-right: 0.186667rem; /* 7/37.5 */
    margin-bottom: 0.266667rem; /* 10/37.5 */
    position: relative;
  }

  .content div .cc_home_img {
    height: 2.186667rem;
    width: 2.186667rem;
    border-radius: 12%;
  }

  .content div .type_img {
    position: absolute;
    top: 0;
    left: 0;
  }

  .content div .img_two:nth-of-type(4n) {
    margin-right: 0;
  }

  .content>.slectlanguage {
    height: 1.333333rem; /* 50/37.5 *//* 30/37.5 */
  }

  .content>.slectlanguage p img:last-child {
    // height:1.333333rem /* 50/37.5 */ /* 30/37.5 */
    transform: rotate(90deg) scale(0.8, 1.5);
  }

  .languagexiala {
    // height: 0;
    overflow: hidden;
  }
}

/* 横屏 */
@media all and (orientation: landscape) {
  .content {
    max-width: 18rem;
  }

  .content>div {
    height: 3.786667rem;
    padding: 0 0.56rem; /* 21/37.5 */
    border-bottom: 0.32rem solid white;
    overflow: hidden;
  }

  .content>div:last-child {
    border-bottom: 0.426667rem solid white;
  }

  .content div p {
    font-size: 0.346667rem; /* 13/37.5 */
    margin-bottom: 0.4rem; /* 15/37.5 */
    margin-top: 0.346667rem; /* 13/37.5 */
    color: #f79ebe;
    font-weight: bold;
  }

  .content div p img {
    width: 0.426667rem; /* 16/37.5 */
    height: 0.426667rem; /* 16/37.5 */
    margin-top: 0.04rem; /* 1.5/37.5 */
    vertical-align: top;
  }

  .content div p img:last-child {
    transform: rotate(90deg) scale(0.8, 1.5);
    float: right;
  }

  .content div .img_two {
    float: left;
    width: 1.92rem; /* 72/37.5 */
    height: 1.92rem; /* 72/37.5 */
    margin-right: 0.266667rem; /* 10/37.5 */
    margin-bottom: 0.32rem; /* 12/37.5 */
    position: relative;
  }

  // .content div .img_two:nth-of-type(7n) {
  // margin-right: 0;
  // }
  .content div .cc_home_img {
    height: 1.92rem;
    width: 1.92rem;
    border-radius: 12%;
  }

  .content div .type_img {
    position: absolute;
    top: 0;
    left: 0;
  }

  // .content div .img_two:nth-of-type(7n) {
  // margin-right: 0;
  // }
  .test {
    font-size: 1.066667rem; /* 40/37.5 */
    color: red;
  }

  .content>.slectlanguage {
    height: 1.4rem; /* 50/37.5 *//* 30/37.5 */
  }

  .languagexiala {
    // height: 0;
    overflow: hidden;
  }
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
</style>

