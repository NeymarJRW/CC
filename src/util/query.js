const doc = document

const baseUri = 'https://lt.76ab.com/Home/'
// const baseUri = 'http://h5.com/Home/'

/* ================================================================ */ 

function addChild(parent, child) {
  return parent.appendChild(child)
}

function newElement(ele) {
  return doc.createElement(ele)
}

function $(ele, parent) {
  return (parent || doc).querySelector(ele)
}

function $all(ele, parent) {
  return (parent || doc).querySelectorAll(ele)
}

function on(ele, type, eventHandle) {
  if(typeof ele.length === "number") {
    let x = 0
    while (x < ele.length) {
      ele[x].addEventListener(type, eventHandle)
      x++
    }
  } else {
    ele.addEventListener(type, eventHandle)
  }
}

/* ================================================================= */ 

function ajax(params, notJson) {
  let xmlhttp = window.XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject("Microsoft.XMLHTTP")
  let type = params.type || 'GET'
  let data = params.data || {}
  let url = params.url
  let str = ''
  if (params.data) {
    for (let attr in data) {
      str += attr + '=' + data[attr] + '&'
    }
    str = str.slice(0, -1)
  }
  xmlhttp.open(type, url, true)
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  xmlhttp.send(str)
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        if(notJson) {
          params.success && params.success(xmlhttp.responseText)
        } else {
          params.success && params.success(JSON.parse(xmlhttp.responseText))
        }
      } else {
        params.fail && params.fail()
      }
    }
  }
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = doc.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * 获取url中的参数
 * @param {需要获取的参数} name 
 */ 
function loadPageVar(name) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(name).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

/**
 * 删除url指定参数
 * @param {需要删除的url参数} name 
 */ 
function urlDelete(name) {
  var loca = window.location;
  var baseUrl = loca.origin + loca.pathname + "?";
  var query = loca.search.substr(1);
  if (query.indexOf(name) > -1) {
    var obj = {}
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    };
    delete obj[name];
    var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
    return url
  } else {
    return window.location.href
  }
}

export { addChild, newElement, $, $all, on, ajax, getCookie, loadPageVar, urlDelete, doc, baseUri }

// addEventListener("click", eventHandle, false) 
