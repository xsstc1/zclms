import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from "./router/router" //引入路由
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'
import Cookies from 'js-cookie'
import {
  Notification,
  MessageBox
} from 'element-ui'

import * as psyFun from './assets/js/psy.js' //引入自定义函数
import store from './vuex/store' //引入vuex

import 'normalize.css/normalize.css'
require('./assets/css/base.css') //引入基础css

Vue.use(ElementUI);
Vue.use(VueQuillEditor);


//遍历方法，从而在过滤器中调用
Object.keys(psyFun).forEach(k => Vue.filter(k, psyFun[k]));
//将自定义方法赋给 prototype,实现全局调用
Vue.prototype.publicFun = psyFun;


if (!!window.ActiveXObject || "ActiveXObject" in window) {
  Notification.warning({
    title: '您的浏览器为IE',
    message: '为了获得更好的体验，请使用最新版谷歌Chrome、火狐或360浏览器访问',
    duration: 0,
    onClose: () => {
      MessageBox.confirm('是否前往下载浏览器？', {
        confirmButtonText: '前往',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        window.open("http://browsehappy.osfipin.com/")
      }).catch();

    }
  })
}else if(navigator.userAgent.indexOf('Chrome') != -1){
  let regChrome = /chrome\/[\d.]+/gi;
  // console.log(navigator.userAgent.match(regChrome))
  let chromeEdition = navigator.userAgent.match(regChrome)[0];
  let chromeType = chromeEdition.split(".")[0];
  if(chromeType.split("/")[1]<45){
    Notification.warning({
      title: '您的浏览器版本太旧',
      message: '为了获得更好的体验，请使用最新版谷歌Chrome、火狐或360浏览器访问',
      duration: 0,
      onClose: () => {
        MessageBox.confirm('是否前往下载浏览器？', {
          confirmButtonText: '前往',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          window.open("http://browsehappy.osfipin.com/")
        }).catch();

      }
    })
  }
}

// 创建路由，并配置NProgress
const whiteList = ['/login'];
router.addRoutes(store.getters.addRouters);
var wechat = navigator.userAgent.toLowerCase();
if (wechat.match(/MicroMessenger/i) == "micromessenger") {
  location.href = "#/leaveWeChat"
} else {
  if (location.hash == "#/leaveWeChat") {
    location.href = "#/login"
  } else {

    router.beforeEach((to, from, next) => {
      // NProgress.start();
      let session = Cookies.get("session");
      if (session != "false" && session != undefined) {
        if (to.path === '/login') {
          next({
            path: '/'
          });
        } else {
          next();
        }
      } else {
        if (whiteList.indexOf(to.path) !== -1) {
          next();
        } else {
          next('/login');
          // NProgress.done();
        }
      }

    });
    router.afterEach(() => {

      NProgress.done();

    });
  }

}



const app = new Vue({
  store,
  router: router,
  render: h => h(App)
}).$mount('#app')
