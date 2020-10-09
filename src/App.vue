<template>
  <!-- :style="{ width: width+'px', height: height + 'px' }" -->
  <div id="app">
    <div class="nav" ref="nav">
      <img src="./images/xixi.png" class="topimg" alt />
    </div>
    <!-- <div class="screentishi" ref="screentishi" id="screentishi">
      <div class="top">
        <p>{{language==true ? '提示:请旋转屏幕' : 'Tips:Please rotate the screen'}}</p>
      </div>
      <div class="middle">
        <img :src='Rotate' alt="">
      </div>
    </div>-->
    <div id="cc_container" ref="cc_container">
      <router-view class="cc_container" ref="cc_container_in" />
    </div>

    <div class="tishi" ref="tishi">
      <p>无网络连接</p>
    </div>
    <div ref="cc_tab">
      <tabbar class="cc_tab" icon-class="cc_icon">
        <div class="pic">
          <img src="./images/xixi.png" alt class="img" />
        </div>
        <tabbar-item link="/" :selected="p1">
          <img slot="icon" src="./images/home/rec.png" />
        </tabbar-item>
        <tabbar-item link="/new" :selected="p2">
          <img slot="icon" src="./images/home/new.png" />
        </tabbar-item>
        <tabbar-item link="/hot" :selected="p3">
          <img slot="icon" src="./images/home/hot.png" />
        </tabbar-item>
        <tabbar-item link="/type" :selected="p4">
          <img slot="icon" src="./images/home/type.png" />
        </tabbar-item>
        <tabbar-item link="/my" :selected="p5">
          <img slot="icon" src="./images/home/my.png" />
        </tabbar-item>
      </tabbar>
    </div>
    <!-- <div class="bottom">
        @2020 领码时空公司官网 京ICP备17068492号
    </div>-->
  </div>
</template>
<script>
import $ from "jquery";
import { Languge, Iphonex } from "./api/index.js";
import { Tabbar, TabbarItem } from "vux";
import { zhLogo, enLogo, rotate } from "./api/img.js";
import bottom from "./components/bottom";
export default {
  data() {
    return {
      Rotate: "",
      zhpic: "",
      enpic: "",
      language: true, //通过判断中英文来显示上面的图片
      p1: false,
      p2: false,
      p3: false,
      p4: false,
      p5: false
    };
  },
  components: {
    Tabbar,
    TabbarItem
  },
  methods: {},
  mounted() {
    var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
    lang = lang.substr(0, 2);
    if (lang != "zh") {
      this.$store.state.Langugeflag = false;
    }
    // if (localStorage.getItem("language") == "zn") {
    //   this.$store.state.Langugeflag = true;
    // }
    // if (localStorage.getItem("language") == "en") {
    //   this.$store.state.Langugeflag = false;
    // }

    console.log("-------------------------");
    console.log(this.$store.state.Langugeflag);
    console.log("-------------------------");

    // alert(Iphonex())
    this.p1 = true;
    if (navigator.onLine) {
      this.$refs.tishi.style.display = "none";
    }
    window.addEventListener("online", () => {
      this.$refs.tishi.style.display = "none";
    });
    window.addEventListener("offline", () => {
      this.$refs.tishi.style.display = "flex";
    });
    var top_img = doc(".topimg");
    var daohang_img = doc(".img");
    if (this.$store.state.Langugeflag) {
      this.language = true;
      daohang_img.src = zhLogo;
      top_img.src = zhLogo;
    } else {
      this.language = false;
      daohang_img.src = enLogo;
      top_img.src = enLogo;
    }
    if (this.language == false) {
      document.title = "cicigirl";
    }
    if (this.language == true) {
      document.title = "茜茜公主";
    }
    var w = docEl.clientWidth;
    var h = docEl.clientHeight;
    var app = doc("#app");
    var nav = doc(".nav");
    var cc_container = doc("#cc_container");
    app.style.height = h + "px";
    app.style.width = w + "px";
    var str = window.location.hash.split("/")[1].split("?")[0];
    var fenlei = window.location.hash.split("/")[1];
    if (str == "fenlei") {
      this.$refs.cc_tab.style.display = "none";
    } else {
      this.$refs.cc_tab.style.display = "block";
    }
    if (w > h) {
      nav.style.display = "none";
      if (str == "game") {
      } else {
        if (Iphonex()) {
          cc_container.style.padding = "0 0 0 2rem";
          doc(".cc_tab").style.margin = "0 0 0 0.93rem";
        } else {
          cc_container.style.padding = "0 0 0 1.33rem";
        }
      }
    } else {
      nav.style.display = "block";
      cc_container.style.padding = "0";
      doc(".cc_tab").style.margin = "0";
    }
    var that = this;
    const languge = () => {
      var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
      lang = lang.substr(0, 2);
      return lang;
    };
    if (this.$store.state.Langugeflag) {
      this.language = true;
    } else {
      this.languge = false;
    }
    window.addEventListener("resize", function() {
      var str = window.location.hash.split("/")[1].split("?")[0];
      var cc_container = doc("#cc_container");
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      app.style.height = h + "px";
      app.style.width = w + "px";
      if (w > h) {
        //横屏
        if (str == "game") {
          cc_container.style.padding = "0";
        } else {
          if (Iphonex()) {
            cc_container.style.padding = "0 0 0 2rem";
            doc(".cc_tab").style.margin = "0 0 0 0.93rem";
          } else {
            cc_container.style.padding = "0 0 0 1.33rem";
          }
        }
        nav.style.display = "none";
        that.$refs.cc_container.style.height = "100%";
      } else {
        //竖屏
        doc(".cc_tab").style.margin = "0";

        if (str == "fenlei") {
          that.$refs.cc_container.style.height = "100%";
          cc_container.style.padding = "0";
          nav.style.display = "block";
        } else if (str == "game") {
          cc_container.style.padding = "0";
          nav.style.display = "none";
          // that.$refs.cc_container.style.height = "calc(100% - 2.466667rem)";
        } else {
          that.$refs.cc_container.style.padding = "0";
          nav.style.display = "block";
          that.$refs.cc_container.style.height = "calc(100% - 2.466667rem)";
        }
      }
    });
  },
  computed: {
    f1() {
      return this.$store.state.Langugeflag;
    }
  },
  watch: {
    $route(to, from) {
      var cc_container = document.querySelector("#cc_container");
      this.Rotate = rotate;
      // this.$refs.screentishi.style.display='none'
      const languge = () => {
        var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
        lang = lang.substr(0, 2);
        return lang;
      };
      var top_img = doc(".topimg");
      var daohang_img = doc(".img");
      if (this.$store.state.Langugeflag) {
        this.language = true;
        daohang_img.src = zhLogo;
        top_img.src = zhLogo;
      } else {
        this.language = false;
        daohang_img.src = enLogo;
        top_img.src = enLogo;
      }
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      if (to.path === "/") {
        Object.assign(this.$data, this.$options.data());
        this.p1 = true;
      } else if (to.path === "/new") {
        Object.assign(this.$data, this.$options.data());
        this.p2 = true;
      } else if (to.path === "/hot") {
        Object.assign(this.$data, this.$options.data());
        this.p3 = true;
      } else if (to.path === "/type") {
        Object.assign(this.$data, this.$options.data());
        this.p4 = true;
      } else if (to.path === "/my") {
        Object.assign(this.$data, this.$options.data());
        this.p5 = true;
      }
      if (to.name == "game") {
        this.$refs.cc_container.style.padding = "0";
        this.$refs.nav.style.display = "none";
        this.$refs.cc_container.style.height = "100%";
        this.$refs.cc_tab.style.display = "none";
      }
      // 隐藏首页广告
      // if (to.name != "index" ) {
      //   localStorage.setItem('indexAd',2);//判断首页广告是否已存在
      //   document.querySelector('.adsbygoogle').style.display='none'
      //   window.removeEventListener('resize',this.listenAd)
      // }else{
      //   localStorage.setItem('indexAd',1);
      //    this.indexAd();
      //    window.addEventListener("resize",this.listenAd)
      // }
      if (
        to.name == "index" ||
        to.name == "my" ||
        to.name == "type" ||
        to.name == "hot" ||
        to.name == "new"
      ) {
        // alert(to.name)
        if (w > h) {
          if (Iphonex()) {
            cc_container.style.padding = "0 0 0 2rem";
            doc(".cc_tab").style.margin = "0 0 0 0.93rem";
          } else {
            cc_container.style.padding = "0 0 0 1.33rem";
          }
          this.$refs.nav.style.display = "none";
        } else {
          // alert(to.name)

          //竖屏
          this.$refs.cc_container.style.padding = "0";
          this.$refs.nav.style.display = "block";
          doc(".cc_tab").style.margin = "0";
          this.$refs.cc_container.style.height = "calc(100% - 2.466667rem)";

          // this.$refs.cc_container.style.height='100%'
        }
        console.log("ssssss")
        this.$refs.cc_tab.style.display = "block";
      }
      if (to.name == "fenlei") {
        console.log("fenlei");
        // document.querySelector('.adsbygoogle').style.display = 'none'
        this.$refs.cc_container.style.height = "100%";
        if (w > h) {
          this.$refs.cc_tab.style.display = "none";
          if (Iphonex()) {
            cc_container.style.padding = "0 0 0 2rem";
            if (doc(".cc_tab")) {
              doc(".cc_tab").style.margin = "0 0 0 0.93rem";
            }
          } else {
            cc_container.style.padding = "0 0 0 1.33rem";
          }
        } else {
          this.$refs.nav.style.display = "block";
          this.$refs.cc_tab.style.display = "none";
        }
      }
    },
    f1(curVal, oldVal) {
      var top_img = doc(".topimg");
      var daohang_img = doc(".img");
      if (curVal) {
        top_img.src = zhLogo;
        daohang_img.src = zhLogo;
      } else {
        top_img.src = enLogo;
        daohang_img.src = enLogo;
      }
    }
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/reset.less";
</style>

<style lang="stylus">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-style: none;
  text-decoration: none;
  box-sizing: border-box;
}

html, body {
  // background #333
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  width: 100%;
  font-size: inherit;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  /* 用于 ios5+ */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: inherit;
  overflow: hidden;
}

input, textarea {
  border: none;
}

input:focus, textarea:focus, button:focus {
  outline: none;
}

img {
  font-size: 0;
}

.cc_icon {
  width: 0.853333rem !important;
  height: 0.853333rem !important;
}
</style>

<style lang="stylus" scoped>
.nav {
  // height: 1.733333rem; /* 65/37.5 */
  height: 1.2rem;
  /* 65/37.5 */
  /* 45/37.5 */
  background: #ee436d;
  position: relative;
  text-align: center;
  z-index: 0;

  img {
    height: 1.12rem;
    position: absolute;
    bottom: 0;
    transform: translate(-50%, 0);
  }
}

.nav .changelist {
  height: 100%;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // background red
  // z-index 9999
}

.nav .changelist p {
  color: white;
  font-size: 0.4rem; /* 15/37.5 */
}

.nav .changelist select {
  color: white;
  // float right
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
  display: none;
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
  /* 130/37.5 */
  font-size: 0.533333rem; /* 20/37.5 */
  text-align: center;
  box-sizing: border-box;
  padding: 0.293333rem 0.426667rem 0.2rem 0.426667rem;
}

.screentishi .middle img {
  width: 2.133333rem; /* 80/37.5 */
}

// 竖屏
@media all and (orientation: portrait) {
  #cc_container {
    height: calc(100% - 2.466667rem);
  }

  .pic {
    display: none;
  }

  .cc_container {
    height: 100%;
    overflow-y: scroll;
    background: #fff1f6;
  }

  .weui-tabbar {
    background: #ee436d;
    height: 1.28rem;
    bottom: 0;
  }

  .weui-tabbar a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .weui-bar__item_on {
    background: #fa7797;
  }

  .tishi {
    width: 100%;
    height: 100%;
    // display flex
    display: none;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;

    p {
      color: #fff;
      width: 45%;
      padding: 0.213333rem 0;
      border-radius: 0.266667rem;
      /* 10/37.5 */
      background: #333;
      text-align: center;
      font-size: 0.48rem;
      /* 18/37.5 */
    }
  }
}

/* 横屏 */
@media all and (orientation: landscape) {
  #cc_container {
    height: 100%;
    overflow-y: scroll;
    background: #fff1f6;
  }

  .nav {
    display: none;
  }

  .weui-tabbar {
    background: #ee436d;
    height: 100%;
    width: 1.333333rem;
    /* 50/37.5 */
    display: flex;
    flex-direction: column;
  }

  .weui-tabbar .pic {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .weui-tabbar .img {
    width: 1.066667rem;
    /* 40/37.5 */
    margin: 0.266667rem 0;
  }

  .weui-tabbar a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .weui-bar__item_on {
    background: #fa7797;
  }

  .cc_container {
    height: 100%;
    background: #fff1f6;
  }

  .tishi {
    width: 100%;
    height: 100%;
    border-radius: 0.266667rem;
    /* 10/37.5 */
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    // align-content center
  }

  .tishi p {
    color: #fff;
    width: 25%;
    padding: 0.133333rem 0;
    border-radius: 0.266667rem;
    /* 10/37.5 */
    background: #333;
    text-align: center;
    font-size: 0.48rem;
    /* 18/37.5 */
  }
}
</style>