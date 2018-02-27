import Vue from 'vue'
import axios from 'axios';
import NProgress from 'nprogress'
import {
  Message
} from 'element-ui';
import Cookies from 'js-cookie';

export function getHttpHead(s) {
  var r = new RegExp("(http.*\/\/[^\/]+\/)");
  var a = r.exec(s);
  if (a) {
    return a[1];
  }
};


export function setIntNum(data) {
  return Math.round(data * 100);
}

// 处理Excel导出时间
export function beautyDate(date) {
  if (date) {
    // let dateBeauty = date.split("/");
    // return dateBeauty[2] + "-" + dateBeauty[0] + "-" + dateBeauty[1];
    return date
  } else {
    return null
  }
}

// 处理空电话号码
export function emptyMobile(data) {
  if (data == "" || data == null) {
    return "-"
  } else {
    return data
  }
}

// 时间转换成时间戳
export function get_unix_time(dateStr) {
  var newstr = dateStr.replace(/-/g, '/');
  var date = new Date(newstr);
  var time_str = date.getTime().toString();
  return time_str.substr(0, 13);
}


// 时间戳转化成时间
export function formatDate(date) {
  var now = new Date(date);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (hour < 10) {
    var hour = "0" + now.getHours();
  } else if (minute < 10) {
    var minute = "0" + now.getMinutes();
  } else if (second < 10) {
    var second = "0" + now.getSeconds();
  }
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

export function formatDateView(date) {
  if (date == null) {
    return "未完成"
  } else {
    var now = new Date(date);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }
}
export function formatDateYear(date) {
  if (date) {
    var now = new Date(date);
    var year = now.getFullYear();
    return year;
  } else {
    return null;
  }
}
export function formatDateMonth(date) {
  if (date) {
    var now = new Date(date);
    var month = now.getMonth() + 1;
    return month;
  } else {
    return null;
  }
}
export function formatDateShort(date) {
  if (date) {
    var now = new Date(date);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date;
  } else {
    return null;
  }
}

export function formatDateShortView(date) {
  if (date == null) {
    return "未完成"
  } else {
    var now = new Date(date);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (minute < 10) {
      var minute = "0" + now.getMinutes();
    } else if (second < 10) {
      var second = "0" + now.getSeconds();
    }
    return year + "-" + month + "-" + date;
  }
}

//验证邮箱格式是否正确
export function verityEmail(data) {
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data)) {
    return true;
  } else {
    return false;
  }
}

//验证电话号码是否正确
export function verityMobile(data) {
  var regu = /^[1][0-9][0-9]{9}$/;
  var re = new RegExp(regu);
  if (re.test(data)) {
    return false;
  } else if (data == undefined || data == "") {
    return false;
  } else {
    return true;
  }
}

// 获取URL参数
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = "";
  if (r != null)
    context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}

export function loginOutRequest(type, url, data, callback, params) {
  const localhost = location.origin;
  axios({
    method: type,
    url: localhost + "/icms/" + url,
    data: data,
    params: params
  }).then(response => {
    let result = response.data;
    if (result.code == 0) {
      callback(result.code, result.record, result.msg);
    } else {
      callback(result.code, result.record, result.msg);
    }
  }).catch((error) => {});
}

// 网络传输
export function httpRequest(type, url, data, callback, params) {
  const localhost = location.origin;
  NProgress.start();
  axios({
    method: type,
    url: encodeURI(localhost + "/icms/" + url),
    data: data,
    params: params
  }).then(response => {
    NProgress.done();
    let result = response.data;
    if (result.code == 0) {
      if (result.msg.indexOf("退出成功") != -1) {
        Message({
          message: "您的登陆信息已过期，请重新登录",
          type: 'error',
          duration: 2 * 1000
        });
        Cookies.set("session", false);
        if (location.hash != "#/login") {
          window.localStorage.lastLocation = location.href;
        }
        window.localStorage.lastLoginName = JSON.parse(window.localStorage.userInfo).userLoginName;
        setTimeout(() => {
          window.location.href = "#/login"
        }, 2000);
        return false;
      } else {
        callback(result.code, result.record, result.msg);
      }
    } else {
      callback(result.code, result.record, result.msg);
    }
  }).catch((error) => {});
}

// 数组去重
export function unique(arr){
　　var res =[];
　　var json = {};
　　for(var i=0;i<arr.length;i++){
　　　　if(!json[arr[i]]){
　　　　　　res.push(arr[i]);
　　　　　　json[arr[i]] = 1;
　　　　}
　　}
　　return res;
}

export function handleIELoading(callback){
  if (!!window.ActiveXObject || "ActiveXObject" in window){
    setTimeout(()=>{
      callback()
    },500)
  }else{
    callback()
  }
}

// 增加删除数组方法
Array.prototype.removeByValue = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}
