import Vue from 'vue'
import App from './App.vue'

import global from "./config/index"
import store from "./store"
import './assets/common.css';
// import 'leaflet-draw'
// import 'leaflet-draw/dist/leaflet.draw.css'
// import L from "leaflet"
// import "leaflet"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import VueCesium from 'vue-cesium'
// import 'video.js/dist/video-js.css'

Vue.prototype.Global = global;
Vue.config.productionTip = false
Vue.use(ElementUI)
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg5NmQzMi1lN2M3LTQxZTktOTAyYS01MDFkM2RjYTgyOGMiLCJpZCI6MzQ2NjgsImlhdCI6MTYwMDY4Mzg0OX0.vv0m2W-E8Vmi3VleFtwfTRBYdSoNdBCS-COnZVgN3Zc'

// Vue.prototype.$http = http; // 全局注册$http --> this.$http
// Vue.L = Vue.prototype.$L = L; // 全局注册leaflet
// Vue.use(VueCesium, {
//     cesiumPath: 'https://unpkg.com/cesium/Build/Cesium/Cesium.js',
//     // 指定Cesium.Ion.defaultAccessToken，使用Cesium ion的数据源需要到https://cesium.com/ion/申请一个账户，获取Access Token。不指定的话可能导致 Cesium 在线影像加载不了
//     accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg5NmQzMi1lN2M3LTQxZTktOTAyYS01MDFkM2RjYTgyOGMiLCJpZCI6MzQ2NjgsImlhdCI6MTYwMDY4Mzg0OX0.vv0m2W-E8Vmi3VleFtwfTRBYdSoNdBCS-COnZVgN3Zc'
//   })

/* eslint-disable */
delete L.Icon.Default.prototype._getIconUrl;
/* eslint-disable */
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
new Vue({
    store,
  render: h => h(App),
}).$mount('#app')
