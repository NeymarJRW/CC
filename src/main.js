import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import localForage from "localforage";
import 'amfe-flexible'
import VueLazyLoad from 'vue-lazyload'
import {
  loading
} from './api/img.js'
Vue.use(localForage)
import Ads from 'vue-google-adsense'

  if(window.girlBoxGame){
    girlBoxGame.end()
  }
Vue.use(require('vue-script2'))
Vue.use(Ads.Adsense)
Vue.use(Ads.InArticleAdsense)
Vue.use(Ads.InFeedAdsense)
Vue.use(localForage)
Vue.use(VueLazyLoad, {
  loading: loading,
})
// Vue.use($)
Vue.prototype.axios = axios;
window.log = console.log;
window.clear = clearTimeout;
window.settime = setTimeout;
window.doc = document.querySelector.bind(document);
window.docEl = document.documentElement;
window.localForage = localForage;

axios.interceptors.response.use(
  response => {
    if (response.status == '404') {
      // router.push({path:'error'})
      //  if (response.status == '200') {
      //    router.push({
      //      path: '/'
      //    })
      //  }
    }
    return response;
  },
  error => {

    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

//全局守卫
router.beforeEach((to, from, next) => {
  if (from.name == 'error') {
    if (navigator.onLine) {
      next()
    } else {
      next({
        path: 'error'
      })
    }
  } else {
    next()
  }
})
detectOrient()
window.onresize = function () {
  detectOrient()
}
//判断横屏竖屏
function detectOrient() {
  var width = docEl.clientWidth,
    height = docEl.clientHeight

  if (width <= height) {
    //竖屏
    if (width === 424 && height === 753) {
      //荣耀手机
      document.getElementsByTagName("html")[0].style.fontSize = 50 + "px"
    }
    //竖屏
  } else {
    // 横屏
    if (height === 768 && width === 1024) {
      //ipad
      height = 570
    } else if (height === 375 && width === 812) {
      //iphone X
      height = 400
    } else if (height > 750) {
      height = 750
    }

    if ((height / width) < 0.47 && height < 290) {
      if(width>800){
        height=420
      }else{
         height = 320
      }
    } else if ((height / width) < 0.48 && height < 320) {
      height = 350

    } else if ((height / width) < 0.48 && height < 360) {
      height = 380
    }

    document.getElementsByTagName("html")[0].style.fontSize = height / 10 + "px"
    return false
  }
}

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')