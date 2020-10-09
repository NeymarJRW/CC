<template>
  <div>
    <div class="content" ref="content">
      <div class="top">
        <img src="../images/logo.png" alt>
      </div>
      <div class="fanhui" @click="back">
        <img src="../images/back.png" alt>
      </div>
      <div class="gamebox" style="overflow:hidden">
        <div class="img_two" v-for="(i,index) in fanhuiyouxi" @click="dianji(i)">
          <img
            v-lazy="i.image.indexOf('http')== 0 ? i.image : baseUrl+i.image"
            class="cc_home_img"
            alt=''
          >
            <img
              v-if='i.type==1||i.type==2'
              class="cc_home_img type_img"
              v-lazy="i.type==1 ? iosPic : (i.type==2 ? andPic : '' )"
              alt=''
              @click="sendUrl(i.url)"
            >
      </div>
       <p
          class="tishi"
        v-show="footerTishi"
        style="text-align:center;color:#949494;font-size:0.386667rem"
      >{{nameFlag ? '没有游戏了...' :'No more games...'}}</p>
      </div>
       
    </div>

  </div>
</template>

<script>
import ios from '../images/ios.png'
import and from '../images/and.png'
import {
  saveGame,
  clickNum,
  idReturnClass,
  idReturnLabel,
  baseUrl,
  Ua,
  scrollBottom,
} from "../api/index.js";
export default {
  data() {
    return {
      fanhuiyouxi: [],
      liulan: [],
      liulan_id: [],
      xiala_name: "",
      //baseUrl: "",
      page: 0,
      footerTishi: false,
      nameFlag:true,
      iosPic:'',
      andPic:'',
      test:false
    };
  },
  watch:{
    footerTishi(value){
      var content=doc('.content') 
      var gamebox=doc('.gamebox');
      if(gamebox.clientHeight<content.clientHeight){
        this.footerTishi=false
      }
      var con = doc(".content");
      con.removeEventListener('scroll', this.scrollfun)
    },
      $route(to,from){
        if(to.path == '/fenlei'){
          this.getData()
        }
    }
  },
  methods: {
    sendUrl:function(gameurl){
       if(window.webkit) {
          var param = {
            type: "openappstore",
            url: gameurl
          }
          window.webkit.messageHandlers.girlBoxGame.postMessage(param)
        }
        if(window.girlBoxGame){
          girlBoxGame.visit(gameurl)
        }
       var pinjie=`type=openappstore&url=${gameurl}`
      iframeSend(pinjie);
    },
    back() {
      this.$router.back(-1);
    },
    dianji: function(arr) {
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
      if(window.webkit) {
          window.webkit.messageHandlers.girlBoxGame.postMessage(direction)
      }
      if(window.girlBoxGame){
        girlBoxGame.direction(direction)
      }
      // location.hash=`#/fenlei?air=1&direction=${direction}`
      var w = docEl.clientWidth;
      var h = docEl.clientHeight;
      localStorage.setItem('screenWidth',w)
      localStorage.setItem('screenHidth',h)
      arr.air = 1
      arr.direction = direction
      this.$router.push({ name: "game", query: arr });

    },
    scrollfun:function(){
     var con = doc(".gamebox");
      var scrollTop = con.scrollTop; //变量windowHeight是可视区的高度
      var windowHeight = con.clientHeight; //变量scrollHeight是滚动条的总高度
      var scrollHeight = con.scrollHeight; //滚动条到底部的条件
      if ((scrollTop + windowHeight) == scrollHeight) {
        //写后台加载数据的函数
          if(this.$route.query==1){
            this.baseUrl = baseUrl;
            idReturnClass({ cId: this.$route.query.id, page:this.page++, type: Ua}).then(res => {
             if(res.state=='1'){
              res.msg.forEach(item => {
                this.fanhuiyouxi.push(item);
              });
             }else{
                this.footerTishi=true;
             }
            });
          } else{
            idReturnLabel({ lId: this.$route.query.id,page: this.page++, type: Ua }).then(res => {
             if(res.state=='1'){
              res.msg.forEach(item => {
                this.fanhuiyouxi.push(item);
              });
             }else{
                this.footerTishi=true;
                 
             }
            });
          }
 
      }
    },
    getData() {
      this.iosPic=ios;
      this.andPic=and;
      this.baseUrl = baseUrl;
      var h = docEl.clientHeight;
      this.fanhuiyouxi = []
      this.page = 0
      var fun= ()=>{  
        if(this.$route.query.name=='1'){
            idReturnClass({ 
              cId: this.$route.query.id,
              page: this.page++,
              type: Ua
            }).then(res => {
              if(res.state=='1'){
                for(var index in res.msg){
                  this.fanhuiyouxi.push(res.msg[index])
                }
                if(this.page < 4){
                  fun()
                }
              }else{
                this.footerTishi = true;
              }
            });

        }else{
            idReturnLabel({ lId: this.$route.query.id, page: this.page++, type: Ua }).then(
              res => {
                if(res.state=='1'){
                for(var index in res.msg){
                    this.fanhuiyouxi.push(res.msg[index])
                  }
                  if(this.page<4){
                    fun()
                  }
                }else{
                  this.footerTishi=true;
                }

              }
            );
        }
      }
      if(this.$route.query.name=='1'){
        idReturnClass({ cId: this.$route.query.id, page: this.page++, type: Ua }).then(res => {
          if(res.state=='1'){
            for(var index in res.msg){
              this.fanhuiyouxi.push(res.msg[index])
            }
            fun()
          }else{
            this.footerTishi=true;
          }
        });
      }else{
        idReturnLabel({ lId: this.$route.query.id, page: this.page++, type: Ua }).then(res => {
          if(res.state=='1'){
            this.fanhuiyouxi = res.msg;
            fun()
          }else{
            this.footerTishi=true;
          }
        });
      }
      var con = doc(".content");
      con.style.overflow = "scroll";
      con.addEventListener('scroll', this.scrollfun)
    }
  },
  mounted() {
    this.getData()
  }
};
</script>

<style lang="stylus" scoped>
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
    z-index:10000
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 0 0 2rem 0.32rem;
  }
.content  p{
  clear both

}
  .content .img_two {

    float: left;
    width: 2.186667rem; /* 82/37.5 */
    height: 2.186667rem; /* 82/37.5 */
    margin: 0.266667rem 0.186667rem 0 0;
    position: relative;
    overflow:hidden;
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

  .top {
    display: none;
  }

  .fanhui img {
    width: 0.933333rem; /* 35/37.5 */
    height: 0.933333rem; /* 35/37.5 */
    z-index:10000
  }
}

@media all and (orientation: landscape) {
  .content {
    width: 100%;
    height: 100%;
    padding: 0 0 2rem 0.32rem;

  }
  .content  p{
  clear:both

  }

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

  .top {
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

  .top img {
    width: 1.333333rem; /* 50/37.5 */
    height: 0.8rem; /* 30/37.5 */
    transform: translate(0, -50%);
  }
}
</style>

