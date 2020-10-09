import qs from 'qs'
import axios from 'axios'
import {
  newElement,
  addChild,
  doc,
  $,
  on,
  ajax,
  baseUri,
  $all,
  urlDelete,
  loadPageVar
} from "../util/query.js";

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

var uri = 'https://www.cicigirl.com/'
// var uri = 'http://test.cicigirl.com'

var ua = function () {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var isWeixin = u.indexOf('miniProgram') > -1;
  if (isWeixin) {
    //微信小程序
    return 3
  } else if (isAndroid) {
    //安卓
    return 2
  }else{
    //ios
    return 1
  }
}

const Http = (params, data) => {
  let option = {
    method: params.method || 'get',
    url: params.url,
    baseURL: uri,
    params: data,
    data: qs.stringify(data),
  }
  if (params.method === 'post') {
    delete option.params
  } else {
    delete option.data
  }
  return new Promise((resolve, reject) => {
    axios(option)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
//滚动函数

//拼接地址
export const baseUrl = 'https://cicigirl.833223.com/';

//获取home游戏
export const getHome = params => {
  return Http({
    url: '/Home/Api/index'
  }, params)
}

//home游戏缓存
export const HomeCache = () => {
  return localForage.getItem('home_cache')
}

//获取new游戏
export const getNew = params => {
  return Http({
    url: '/Home/Api/news'
  }, params)
}

//new游戏缓存
export const NewCache = ()=>{
  return localForage.getItem('new_cache')
}

//获取hot游戏
export const getHot = params => {
  return Http({
    url: '/Home/Api/hot'
  }, params)
}

//hot游戏缓存
export const HotCache = () => {
  return localForage.getItem('hot_cache')
}

//分类列表
export const getClass = params => {
  return Http({
    url: '/Home/Api/classList'
  }, params)
}

//分类列表缓存
export const ClassCache = () => {
  return localForage.getItem('class_cache')
}

//通过分类id获取游戏
export const idReturnClass = params => {
  return Http({
    url: '/Home/Api/getClass'
  }, params)
}

//标签列表
export const getLabel = params => {
  return Http({
    url: '/Home/Api/labelList'
  }, params)
}

///标签列表缓存
export const LabelCache = () => {
  return localForage.getItem('label_cache')
}

//通过标签id获取游戏
export const idReturnLabel = params => {
  return Http({
    url: '/Home/Api/getLabel'
  }, params)
}

//点击量
export const clickNum = params => {
  return Http({
    method: 'post',
    url: 'Home/Api/clickGame'
  }, params)
}
///标签列表缓存
export const foryuCache = () => {
  return localForage.getItem('foryou_cache')
}
//根据返回的便签推荐游戏
export const returnGame = params => {
  return Http({
    method: 'post',
    url: 'Home/Api/recommend?type=' + ua() + ''
  }, params)
}

//我的页面的时间戳
export const regain = params => {
  return Http({
    method: 'post',
    url: 'Home/Api/customerSyn'
  }, params)
}
//存取游戏
export const saveGame = (game, id, savedata, liulanid) => {
  //获取之前存取的数据
  localForage.getItem('liulan_data').then(function (data) {
    //判断之前是否存过数据      
    if (data) {
      //获取之前存的游戏id
      localForage.getItem('liulan_id').then(function (res) {
        //判断本次存的id是否重复
        if (res.indexOf(liulanid) == -1) {
          //判断储存数据长度          
          if (data.length >= 10) {
            // console.log("chaoguo8")
            data.shift()
            // console.log(data)
            res.shift()
          }
          //如果数据重复,追加本次数据
          game = data;
          game.push(savedata)
          id = res;
          id.push(liulanid)
          localForage.setItem('liulan_data', game) //存浏览游戏数据
          localForage.setItem('liulan_id', id) //存浏览游戏id             
        } else {
          //如果重复让数据还为上一次数据,不追加本次的数据
          game = data;
          id = res;
          localForage.setItem('liulan_data', game) //存浏览游戏数据
          localForage.setItem('liulan_id', id) //存浏览游戏id    
        }
      })
    } else {
      //第一次存
      game.push(savedata)
      localForage.setItem('liulan_data', game)
      localForage.setItem('liulan_id', [liulanid])
    }
  })
}

//判断ios Android  1.ios  2.android

export const Ua = ua();
  //    androidWebview = ua.match(/Android/)


//判断语言
export const Languge = () => {
  var lang = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2);
  return lang
}
export const Iphonex=()=>{
    return ((/iphone/gi.test(navigator.userAgent)) && (screen.height == 812 && screen.width == 375)) ||
       ((/iphone/gi.test(navigator.userAgent)) && (screen.height == 896 && screen.width == 414)) ||
      ((/iphone/gi.test(navigator.userAgent)) && (screen.height == 375 && screen.width == 812)) || 
      ((/iphone/gi.test(navigator.userAgent)) && (screen.height == 414 && screen.width == 896)) ||
       (screen.height == 287 && screen.width == 812)
}
//监听屏幕到底部
export const scrollBottom = (obj, fun ) => {
  function gundong(){
    var scrollTop = obj.scrollTop;
    //变量windowHeight是可视区的高度
    var windowHeight = obj.clientHeight;
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = obj.scrollHeight;
    //滚动条到底部的条件
    if ((scrollTop + windowHeight + 20) > scrollHeight) {
      fun()
    }
  } 
  obj.addEventListener('scroll', gundong)

}
//取消屏幕到底监听
export const cancelscroll = (obj, fun)=>{
  function gundong() {
    var scrollTop = obj.scrollTop;
    //变量windowHeight是可视区的高度
    var windowHeight = obj.clientHeight;
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = obj.scrollHeight;
    //滚动条到底部的条件
    if ((scrollTop + windowHeight + 20) > scrollHeight) {
      fun()
    }
  }
  obj.removeEventListener('scroll', gundong)

}

//iframe传参
export const iframeSend=(pinjieurl)=>{
      var iframe = document.createElement("iframe");
      iframe.src = 'https://www.baidu.com?' + pinjieurl + '&air=1';
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 200);
}
//小球代码
export const Ball =()=>{
      var query = {
        addClass: function (node, classname) {
          if (node.classList) {
            node.classList.add(classname);
            return;
          }
          if (node.className.indexOf(classname) == -1)
            node.className += " " + classname;
        },
        removeClass: function (node, classname) {
          if (node.classList) {
            node.classList.remove(classname);
            return;
          }
          var reg = eval("/" + classname + "/ig");
          node.className = node.className.replace(reg, "");
        }
      };
      function IsPC() {
        //判断是否是pc端
        var userAgentInfo = navigator.userAgent;
        var Agents = [
          "Android",
          "iPhone",
          "SymbianOS",
          "Windows Phone",
          "iPad",
          "iPod"
        ];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        if (
          userAgentInfo.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
        ) {
          flag = false;
        }
        return flag;
      }

      function isWeiXin() {
        //判断是否是微信
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        }
        return false;
      }

      function Inertia(ele, options) {
        var defaults = {
          // 是否吸附边缘
          edge: true,
          startLeft: 0,
          startTop: 0
        };
        var params = {};
        options = options || {};
        for (var key in defaults) {
          if (typeof options[key] !== "undefined") {
            params[key] = options[key];
          } else {
            params[key] = defaults[key];
          }
        }
        var data = {
          distanceX: 100,
          distanceY: 100
        };
        var win = window;
        // 浏览器窗体尺寸
        var winWidth = document.body.clientWidth;
        var winHeight = document.body.clientHeight;
        // console.log(winWidth,winHeight)
        if (!ele) {
          return;
        }
        // 设置transform坐标等方法
        var fnTranslate = function (x, y) {
          x = Math.round(1000 * x) / 1000;
          y = Math.round(1000 * y) / 1000;
          ele.style.webkitTransform =
            "translate(" + [x + "px", y + "px"].join(",") + ")";
          ele.style.transform =
            "translate3d(" + [x + "px", y + "px", 0].join(",") + ")";
        };
        var strStoreDistance = "";
        // 居然有android机子不支持localStorage
        if (
          ele.id &&
          win.localStorage &&
          (strStoreDistance = localStorage["Inertia_" + ele.id])
        ) {
          var arrStoreDistance = strStoreDistance.split(",");
          ele.distanceX = +arrStoreDistance[0];
          ele.distanceY = +arrStoreDistance[1];
          fnTranslate(ele.distanceX, ele.distanceY);
        }
        // 显示拖拽元素
        if (
          ele.id &&
          win.localStorage &&
          (strStoreDistance = localStorage["Inertia_turn_" + ele.id])
        ) {
          if (isWeiXin()) {
            // alert('weixin')
            query.addClass(ele, "ball_right");
            ele.right = ele.offsetWidth / 2 + "px";
          } else {
            if (strStoreDistance == "left") {
              query.addClass(ele, "ball_left");
            }
            if (strStoreDistance == "right") {
              query.addClass(ele, "ball_right");
            }
          }
        } else {
          query.addClass(ele, "ball_right");
          ele.right = ele.offsetWidth / 2 + "px";
        }
        // 如果元素在屏幕之外，位置使用初始值
        var initBound = ele.getBoundingClientRect();
        if (
          initBound.left < -0.5 * initBound.width ||
          initBound.top < -0.5 * initBound.height ||
          initBound.right > winWidth + 0.5 * initBound.width ||
          initBound.bottom > winHeight + 0.5 * initBound.height
        ) {
          ele.distanceX = 0;
          ele.distanceY = 0;
          fnTranslate(0, 0);
        }
        if (isWeiXin()){
         query.addClass(ele, "ball_right");

        }
        ele.addEventListener("touchstart", function (event) {
          var events = event.touches[0] || event;
          data.posX = events.pageX;
          data.posY = events.pageY;
          data.touching = true;
          if (ele.distanceX) {
            data.distanceX = ele.distanceX;
          }
          if (ele.distanceY) {
            data.distanceY = ele.distanceY;
          }
          // 元素的位置数据
          data.bound = ele.getBoundingClientRect();
          params.startLeft = data.bound.left;
          params.startTop = data.bound.top;
          data.timerready = true;
        }, {
          passive: false
        });
        var easeOutBounce = function (t, b, c, d) {
          if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
          } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
          } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
          } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
          }
        };
        doc.addEventListener("touchmove", function (event) {
          if (data.touching !== true) {
            return;
          }
          if (data.timerready == true) {
            data.timerstart = +new Date();
            data.timerready = false;
          }
          event.preventDefault();
          var events = event.touches[0] || event;
          data.nowX = events.pageX;
          data.nowY = events.pageY;
          var distanceX = data.nowX - data.posX,
            distanceY = data.nowY - data.posY;

          // 此时元素的位置
          var absLeft = data.bound.left + distanceX,
            absTop = data.bound.top + distanceY,
            absRight = absLeft + data.bound.width,
            absBottom = absTop + data.bound.height;
          // 边缘检测
          if (absLeft < 0) {
            distanceX = distanceX - absLeft;
          }
          if (absTop < 0) {
            distanceY = distanceY - absTop;
          }
          if (absRight > winWidth) {
            distanceX = distanceX - (absRight - winWidth);
          }
          if (absBottom > winHeight) {
            distanceY = distanceY - (absBottom - winHeight);
          }
          // 元素位置跟随
          var x = data.distanceX + distanceX,
            y = data.distanceY + distanceY;
          fnTranslate(x, y);
          // 缓存移动位置
          ele.distanceX = x;
          ele.distanceY = y;
        }, {
          passive: false
        });

        doc.addEventListener("touchend", function (event) {
          var targetData = ele.getBoundingClientRect(),
            topdatames = targetData.top - params.startTop,
            leftdatames = params.startLeft - targetData.left;
          if (data.touching === false) {
            return;
          }
          data.touching = false;
          // 计算速度
          data.timerend = +new Date();
          if (!data.nowX || !data.nowY) {
            return;
          }
          // 移动的水平和垂直距离
          var distanceX = data.nowX - data.posX,
            distanceY = data.nowY - data.posY;
          if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
            return;
          }
          // 距离和时间
          var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY),
            time = data.timerend - data.timerstart;
          // 速度，每一个自然刷新此时移动的距离
          var speed = (distance / time) * 16.666;
          // 设置衰减速率
          // 数值越小，衰减越快
          var rate = Math.min(10, speed);
          data.inertiaing = true;
          // 反弹的参数
          var reverseX = 1,
            reverseY = 1;
          // 速度计算法
          var step = function () {
            if (data.touching == true) {
              data.inertiaing = false;
              return;
            }
            speed = speed - speed / rate;
            // 根据运动角度，分配给x, y方向
            var moveX = (reverseX * speed * distanceX) / distance,
              moveY = (reverseY * speed * distanceY) / distance;
            // 此时元素的各个数值
            var bound = ele.getBoundingClientRect();
            if (moveX < 0 && bound.left + moveX < 0) {
              moveX = 0 - bound.left;
              // 碰触边缘方向反转
              reverseX = reverseX * -1;
            } else if (moveX > 0 && bound.right + moveX > winWidth) {
              moveX = winWidth - bound.right;
              reverseX = reverseX * -1;
            }
            if (moveY < 0 && bound.top + moveY < 0) {
              moveY = -1 * bound.top;
              reverseY = -1 * reverseY;
            } else if (moveY > 0 && bound.bottom + moveY > winHeight) {
              moveY = winHeight - bound.bottom;
              reverseY = -1 * reverseY;
            }
            var x = ele.distanceX + moveX,
              y = ele.distanceY + moveY;
            // 位置变化
            fnTranslate(x, y);
            ele.distanceX = x;
            ele.distanceY = y;
            if (speed < 0.1) {
              speed = 0;
              if (params.edge == false) {
                data.inertiaing = false;
                if (win.localStorage) {
                  localStorage["Inertia_" + ele.id] = [x, y].join();
                }
              } else {
                // 边缘吸附
                edge();
              }
            } else {
              requestAnimationFrame(step);
            }
          };
          var turn = "";
          var edge = function () {
            // 时间
            var start = 0,
              during = 25;
            // 初始值和变化量
            var init = ele.distanceX,
              y = ele.distanceY,
              change = 0;
            // 判断元素现在在哪个半区
            var bound = ele.getBoundingClientRect();
            if (isWeiXin()) {
              if (bound.left + bound.width / 2 < winWidth / 2) {
                turn = "left";
                change = winWidth - bound.left;
              } else {
                turn = "right";
                change = winWidth - bound.right;
              }
            } else {
              if (bound.left + bound.width / 2 < winWidth / 2) {
                // alert("left")
                turn = "left";
                change = -1 * bound.left;
              } else {
                // alert("right")
                turn = "right";
                change = winWidth - bound.right;
              }
            }
            var ballwidth = ele.offsetWidth;
            var run = function () {
              if (data.touching == true) {
                data.inertiaing = false;
                return;
              }
              start++;
              var x = easeOutBounce(start, init, change, during);
              if (isWeiXin()) {
                query.removeClass(ele, "ball_left");
                query.addClass(ele, "ball_right");
                if (turn == "left") {
                  fnTranslate(x - ballwidth / 1.5, y);
                }
                if (turn == "right") {
                  fnTranslate(x + ballwidth / 3, y);
                }
              } else {
                if (turn == "left") {
                  query.removeClass(ele, "ball_right");
                  query.addClass(ele, "ball_left");
                  fnTranslate(x - ballwidth / 3, y);
                }
                if (turn == "right") {
                  query.removeClass(ele, "ball_left");
                  query.addClass(ele, "ball_right");
                  fnTranslate(x + ballwidth / 3, y);
                }
              }
              if (start < during) {
                requestAnimationFrame(run);
              } else {
                ele.distanceX = x;
                ele.distanceY = y;
                data.inertiaing = false;
                if (win.localStorage) {
                  if (turn == "left") {
                    x = x - ballwidth / 3;
                  } else if (turn == "right") {
                    x = x + ballwidth / 3;
                  }
                  localStorage["Inertia_" + ele.id] = [x, y].join();
                  localStorage["Inertia_turn_" + ele.id] = turn;
                }
              }
              var onchange = x - init;
            };
            run();
          };
          step();
        }, {
          passive: false
        });
      }
      function pageLading() {
          var ballFun = (function () {  
          var h5_ball = $("#ball");
          if (IsPC() == "vertically") {
            //1.判断是否pc端 2.判断有无父页面 3.父页面 position == 'vertically' 是横屏游戏
            h5_ball.style.display = "none";
            return;
          } else {
            if (h5_ball){
            h5_ball.style.display = "block";

            }
          }

      
          var ballHidden = function () {
            query.addClass(doc.body, "cy_ball_hidden");
          };
          let bodyEl = document.body;
          let topS = 0;

          function stopBodyScroll(isFixed) {
            if (isFixed) {
              topS = window.scrollY;
              bodyEl.style.position = "fixed";
              bodyEl.style.top = -topS + "px";
            } else {
              bodyEl.style.position = "";
              bodyEl.style.top = "";
              window.scrollTo(0, topS); // 回到原先的top
            }
          }

          function clickEvent(event) {
            // 动画
            // test
            // $('#cy_gotop').classList.add("cy_animated")
            // $('#cy_gotop').classList.add("cy_infinite")
            // $('#cy_gotop').classList.add("cy_heartBeat")
            // var target = event.target;
            // $('#cy_bones').style.display = 'block';
            // stopBodyScroll("fixed")
          }
          // h5_ball.addEventListener("click", clickEvent, {
          //   passive: false
          // });
          Inertia($("#ball"));

        })();
      }
      pageLading();
  }
    
