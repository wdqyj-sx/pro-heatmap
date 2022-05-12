<template>
  <div class="container" id="capture">
    <div id="cesium-map" v-show="show3Dflag" class="map"></div>
    <l-map
      v-show="!show3Dflag"
      id="map"
      ref="map"
      class="map"
      :zoom="zoom"
      :center="center"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :crs="crs"
      :option="{}"
      :style="{ height: mapHeight }"
    >
    </l-map>
    <div class="custom-tips" v-show="waterDeep.flag" :style="waterDeep.style">
      <p class="pos">
        <span class="icon"></span>
        <span class="value">{{
          currentShowData.lng + "，" + currentShowData.lat
        }}</span>
      </p>
      <p>
        <span> {{ currentShowData.title }}：{{ currentShowData.data }}</span>
      </p>
    </div>
    <div class="selectMap">
      <el-radio-group v-model="radio1" @change="changeShow">
        <el-radio-button label="二维"></el-radio-button>
        <el-radio-button label="三维"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap } from "vue2-leaflet";
import { mapState } from "vuex";
// import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
// import "../../../public/js/leaflet-vector-scalar"
// import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'

export default {
  name: "LeafletMap",
  components: {
    LMap,
  },
  data () {
    return {
      mapTitleLayer: null, // 地图底图图层
      //地图相关控件
      zoom: this.Global.map.zoom,
      center: this.Global.map.center,
      minZoom: this.Global.map.minzoom,
      maxZoom: this.Global.map.maxZoom,
      crs: L.CRS.EPSG3857,
      mapHeight: document.documentElement.clientHeight + "px",
      velocityLayer: null, // 矢量图图层
      scalarLayer: null, // 强度图图层
      waterDeep: {  // 弹窗提示
        style: '',
        flag: false
      },
      show3Dflag: false,
      radio1: '二维'

    };
  },
  computed: {
    ...mapState("moduleMap", {
      titleLayers: (state) => state.map.titleLayers,
      baseLayer: (state) => state.map.baseLayer,
      windData: (state) => {
        return state.map.windData;
      },
      waveData: state => state.map.waveData,
      seaTemperatureData: state => state.map.seaTemperatureData,
      currentData: state => state.map.currentData,
      airPressureData: state => state.map.airPressureData,
      dswrfData: state => state.map.dswrfData,
      aqiData: state => state.map.aqiData,
      coData: state => state.map.coData,
      humidityData: state => state.map.humidityData,
      pm25Data: state => state.map.pm25Data,
      tavgData: state => state.map.tavgData,
      tpData: state => state.map.tpData,

      baseLayerIndex: (state) => state.map.baseLayerIndex,
      windFlag: (state) => state.map.baseLayer[0].active,
      waveFlag: state => state.map.baseLayer[1].active,
      seaTemperatureFlag: state => state.map.baseLayer[2].active,
      currentFlag: state => state.map.baseLayer[3].active,
      airPressureFlag: state => state.map.baseLayer[4].active,
      dswrfFlag: state => state.map.baseLayer[5].active,
      aqiFlag: state => state.map.baseLayer[6].active,
      coFlag: state => state.map.baseLayer[7].active,
      humidityFlag: state => state.map.baseLayer[8].active,
      pm25Flag: state => state.map.baseLayer[9].active,
      tavgFlag: state => state.map.baseLayer[10].active,
      tpFlag: state => state.map.baseLayer[11].active,

      vectorAnimateSwitch: (state) => state.style.vectorAnimateSwitch, // // 全局 矢量动画 开关
      topoLayer: null, // 遮罩图层
      currentShowData: state => state.map.currentShowData,
      //   show3D: state => state.map.show3D
    }),
  },
  mounted () {
    this.initVueLeaflet();
    this.initCesium()

  },
  methods: {
    //注册地图，地图监听
    initVueLeaflet () {
      this.$nextTick(() => {
        this.map = this.$refs.map.mapObject;
        // console.log(this.map)
        window.map = this.map;
        this.map.on("mousemove", (e) => {
          this.$store.commit("moduleMap/SET_LATLNG", e.latlng);
        });
        this.map.on("click", (e) => {
          if (this.baseLayerIndex == null) {
            return;
          }
          this.$store.dispatch("moduleMap/setShowData", {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            layerType: this.baseLayer[this.baseLayerIndex].layerType
          })
          let t = e.originalEvent
          let style = `left:${t.clientX - 98}px;top:${t.clientY - 80}px`;
          this.waterDeep.style = style;
          this.waterDeep.flag = true;
        })
        setTimeout(() => {
          this.initTitleLayer(2);
        }, 1000);
      });
    },
    //加载地图
    initTitleLayer (index) {
      if (this.mapTitleLayer) {
        this.mapTitleLayer.setUrl(this.titleLayers[index].url);
      } else {
        this.mapTitleLayer = L.tileLayer(this.titleLayers[index].url, {}).addTo(
          this.map
        );


      }
    },
    //加载图层
    // 加载风场 洋流图层 海浪图层 矢量
    addVectorLayer (type, data) {

      let obj = {
        colorScale: [
          "rgb(222,255,253)",
          "rgb(234,234,234)",
          "rgb(255,255,255)",
          "rgb(156,156,156)",
          "rgb(255,106,43)",
        ],
        opacity: this.vectorAnimateSwitch ? 0.7 : 0,
      };
      if (type == "wind") {
        obj = {
          ...obj,
          maxVelocity: 35,
          lineWidth: 1,
          particleMultiplier: 1 / 500,
          frameRate: 20,
        };
      } else if (type == 'wave') {
        obj = {
          ...obj,
          maxVelocity: 10,
          lineWidth: 6,
          // velocityScale:0.11,
          particleMultiplier: 1 / 500,
          frameRate: 30,
        }
      } else {
        obj = {
          ...obj,
          maxVelocity: 5,
          lineWidth: 1,
          velocityScale: 0.1,
          particleMultiplier: 1 / 500,
          frameRate: 20,
        }
      }
      this.velocityLayer = new L.velocityLayer({
        displayValues: false,
        displayOptions: {
          velocityType: "",
          displayPosition: "",
          displayEmptyString: "",
        },
        ...obj,
      });


      this.velocityLayer.setData(data);
      this.velocityLayer.onAdd(this.map);
    },
    // 加载 遮罩 图层
    addMaskMap () {
      //layer for disctrict
      // 地图添加topojson图层
      const districtLayer = (layer) => {
        layer.setStyle({ fillColor: '#00192E', weight: 1.5, color: '#464849', opacity: 1, fillOpacity: 1 });
      }

      if (this.topoLayer) {
        this.topoLayer.addData(Geojson);
        this.topoLayer.eachLayer(districtLayer);
        this.topoLayer.addTo(this.map);

      } else {
        //   console.log('sx')
        //changing topojson to geojson
        L.TopoJSON = L.GeoJSON.extend({
          addData: function (jsonData) {
            if (jsonData.type === "Topology") {
              for (let key in jsonData.objects) {
                if (jsonData.objects.hasOwnProperty(key)) {
                  let geojson = topojson.feature(jsonData, jsonData.objects[key]);
                  L.GeoJSON.prototype.addData.call(this, geojson);
                }
              }
            } else {
              L.GeoJSON.prototype.addData.call(this, jsonData);
            }
          }
        });

        // let topoLayer = new L.TopoJSON();
        // console.log(topoLayer)
        this.topoLayer = new L.TopoJSON();

        // console.log()
        // 读取json数据
        this.topoLayer.addData(Geojson);
        this.topoLayer.eachLayer(districtLayer);
        this.topoLayer.addTo(this.map);
        // console.log('加载 mask 图层')
      }
    },
    //强度图
    addScalarLayer (type, data) {
      let config = {};
      switch (type) {
        case "wind":
          config = { ...config, minValue: 0.01, maxValue: 30 };
          break;
        case 'wave':
          config = { ...config, minValue: 0.01, maxValue: 9 }
          break;
        case 'current':
          config = { ...config, minValue: 0.001, maxValue: 2 }
          break;

        case 'seaTemp':
          config = { ...config, minValue: 270, maxValue: 300 }
          break;
        case 'pressure':
          config = { ...config, minValue: 99000, maxValue: 105000 }
          break;
        case 'dswrf':
          config = { ...config, minValue: -1, maxValue: 60000 }
          break;
        case 'aqi':
          config = { ...config, minValue: -1, maxValue: 35000 }
          break;
        case 'co':
          // config = { ...config, minValue: -0.1, maxValue: 0.3 }
          config = { ...config, minValue: 3, maxValue: 20 }

          break;
        case 'pm25':
          config = { ...config, minValue: -18, maxValue: 17 }
          break;
        case 'tavg':
          //   config = { ...config, minValue: 50, maxValue: 250 }
          config = { ...config, minValue: -45, maxValue: 32 }
          break;
        case 'tp':
          config = { ...config, minValue: -1, maxValue: 400 }
          break;
        default:
          config = { ...config, minValue: -30.0, maxValue: 40 };
          break;
      }
      if (this.scalarLayer) {
        this.removeScalarLayer()
      }
      this.scalarLayer = new L.scalarLayer({
        displayValues: false,
        displayOptions: {
          velocityType: "",
          displayPosition: "",
          displayEmptyString: "",
        },
        ...config,
      });

      this.scalarLayer.setData(data);
      //   console.log(this.scalarLayer)

      this.scalarLayer.onAdd(this.map);
      let camvas = this.scalarLayer._canvasLayer.options.pane.children[0]
    //     console.log(camvas)
    //     function drawCanvas(){
    //         return camvas
    //     }
    //   this.cesiumviewer.entities.add({
    //     rectangle: {
    //       coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
    //       //coordinates: new Cesium.BoundingRectangle(0,0,100,100),
    //       material: new Cesium.ImageMaterialProperty({
    //         image: new Cesium.CallbackProperty(drawCanvas, false),
    //         transparent: true,
    //       }),
    //       rotation: Cesium.Math.toRadians(13),
    //     }
    //   })
        // console.log(this.map.layers)
      if (type == 'pressure' || type == "wind" || type == "wave") {
        //如果是压力、风场、海浪
        // 去除遮罩
        this.removeMaskMap()
      }
      else {
        // 添加遮罩
        // this.addMaskMap()
      }
    },

    // j显示/隐藏 矢量动画 图层
    toggleVectorLayer (flag) {
      let canvas = document.querySelector(".velocity-overlay");
      if (canvas) {
        canvas.style.opacity = flag ? "1" : "0";
      }
    },
    // 移除矢量图
    removeVectorLayer () {
      if (this.velocityLayer) {
        this.velocityLayer.onRemove();
        this.velocityLayer = null;
      }
    },
    // 重置所有 气象图层
    resetMapLayer () {
      this.removeVectorLayer();
      this.removeScalarLayer();
      this.removeHeatmap();
      this.removeMaskMap();
    },
    //移除热力图
    removeHeatmap () {
      if (this.heatmapLayer) {
        // this.heatmapLayer.onRemove(this.map);
        this.heatmapLayer.setData({ max: 1000000, min: 9999, data: [] })
      }
    },
    // 移除遮罩 图层
    removeMaskMap () {
      if (this.topoLayer) {
        this.topoLayer.clearLayers()
        this.topoLayer.remove()
      }
    },
    // 移除标量图
    removeScalarLayer () {
      if (this.scalarLayer) {
        this.scalarLayer.onRemove();
        this.scalarLayer = null
      }
    },
    initCesium () {
      let cesiumviewer = new Cesium.Viewer('cesium-map', {
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: false, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: true, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: true, //是否显示点击要素之后显示的信息
        homeButton: false,
        sceneModePicker: false,
        fullscreenButton: false,
        //根据太阳位置开启照明

      })

      cesiumviewer.scene.globe.enableLighting = true
      this.cesiumviewer = cesiumviewer
      window.cesiumviewer = this.cesiumviewer
      //加载天地图
      let TianDiLayer = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=ffd0e61d238085c62d54bf80db7b8a72',
        // url:this.titleLayers[2].url,
        layer: 'img',
        style: 'default',
        tileMatrixSetID: 'w',
        format: 'tiles',
        maximumLevel: 18,
      })
      cesiumviewer.imageryLayers.addImageryProvider(TianDiLayer)
      //设置初始位置
      cesiumviewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.20, 40.55, 10000000)
      });
    },
    changeShow (e) {

      if (e == '二维') {
        this.show3Dflag = false
      }
      if (e == '三维') {
        this.show3Dflag = true
      }
    },
    //加载热力图
    addHeatmap (data, type) {
      // this.resetMapLayer();
      // console.log(data)
      if (this.heatmapLayer != null) {
        this.heatmapLayer.onRemove(this.map)
      }
      let heatData = {};
      let config = { ...this.Global.map.heatmapConfg }, gradient = {};
      console.log(config)
      switch (type) {
        case 'pressure':
          heatData = { max: 1080, min: 990 }
          config = { ...config, radius: 0.4 }
          break;

        case 'salt':
          heatData = { max: 70, min: 0 }
          config = { ...config, radius: 0.4 }
          break;

        case 'wind':
          heatData = { max: 40, min: 0 }
          config = {
            ...config, radius: 0.75,
            // gradient: {   "0.99": "rgba(255,0,0,1)", /* 颜色过渡*/ "0.75": "rgba(255,255,0,1)", "0.5": "rgba(0,255,0,1)", "0.25": "rgba(0,255,255,1)", "0": "rgba(0,0,255,1)"}
          }
          break;

        case 'wave':
          heatData = { max: 6, min: 0 }
          config = {
            ...config, radius: 0.4,
            // gradient: {   "0.99": "rgba(255,0,0,1)", /* 颜色过渡*/ "0.75": "rgba(255,255,0,1)", "0.5": "rgba(0,255,0,1)", "0.25": "rgba(0,255,255,1)", "0": "rgba(0,0,255,1)"}
          }
          break;

        case 'current':
          heatData = { max: 3, min: 0.1 }
          config = {
            ...config, radius: 0.4,
            // gradient: {   "0.99": "rgba(255,0,0,1)", /* 颜色过渡*/ "0.75": "rgba(255,255,0,1)", "0.5": "rgba(0,255,0,1)", "0.25": "rgba(0,255,255,1)", "0": "rgba(0,0,255,1)"}
          }
          break;
        case 'temp':
          heatData = { max: 30, min: -30 }
          config = {
            ...config, radius: 0.4,
            // gradient: {   "0.99": "rgba(255,0,0,1)", /* 颜色过渡*/ "0.75": "rgba(255,255,0,1)", "0.5": "rgba(0,255,0,1)", "0.25": "rgba(0,255,255,1)", "0": "rgba(0,0,255,1)"}
          }
          break;

        default:
          heatData = { max: 100, min: 0 }
          config = { ...config }
          break;
      }
      console.log(config)
      this.heatmapLayer = new HeatmapOverlay(config).addTo(this.map)


      heatData.data = data
      console.log("热力图 开始..", type, data)
      // let {cfg } =  this.heatmapLayer
      // this.heatmapLayer.cfg = {...cfg,...config}
      // this.heatmapLayer.configure(config).setData(heatData)
      this.heatmapLayer.setData(heatData)
    },
  },
  watch: {
    windData () {
      //先移除图层
      this.removeVectorLayer()
      if (this.baseLayerIndex == 0 && this.windFlag) {
        // 添加矢量图
        this.addVectorLayer("wind", this.windData);
        // 添加强度图
        this.addScalarLayer("wind", this.windData);
      } else {
        // 重置所有图层
        this.resetMapLayer()
      }
    },
    waveData () {
      //   console.log('sx')
      this.removeVectorLayer()
      //   console.log(this.baseLayerIndex)
      //   console.log(this.waveFlag)
      if (this.baseLayerIndex == 1 && this.waveFlag) {
        // console.log('sx')
        // console.log(this.waveData)
        this.addVectorLayer('wave', this.waveData);
        this.addScalarLayer('wave', this.waveData)
        // this.addHeatmap(this.waveHotData,'wave')
      } else {
        this.resetMapLayer()
      }
    },
    seaTemperatureData () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 2 && this.seaTemperatureFlag) {
        this.addScalarLayer('seaTemp', this.seaTemperatureData)
        // this.addHeatmap(this.seaTemperatureData);
      } else {
        this.resetMapLayer();
      }
    },
    currentData () {
      this.removeVectorLayer();
      if (this.baseLayerIndex == 3 && this.currentFlag) {
        this.addVectorLayer('current', this.currentData);
        this.addScalarLayer('current', this.currentData)
        // this.addHeatmap(this.currentHotData,'current')
      } else {
        this.resetMapLayer()
      }
    },
    airPressureData () {
      this.removeVectorLayer()
      // console.log(this.airPressureFlag)
      if (this.baseLayerIndex == 4 && this.airPressureFlag) {
        this.addScalarLayer('pressure', this.airPressureData)
        // this.addHeatmap(this.airPressureData,'pressure');
      } else {
        this.resetMapLayer();
      }
    },
    dswrfData () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 5 && this.dswrfFlag) {
        this.addScalarLayer('dswrf', this.dswrfData)

        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    aqiData () {
      //   console.log('sx')
      this.removeVectorLayer()

      if (this.baseLayerIndex == 6 && this.aqiFlag) {
        this.addScalarLayer('aqi', this.aqiData)
        // console.log('sxx')
        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    coData () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 7 && this.coFlag) {
        this.addScalarLayer('co', this.coData)

        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    humidityData () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 8 && this.humidityFlag) {
        this.addScalarLayer('humidity', this.humidityData)

        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    pm25Data () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 9 && this.pm25Flag) {
        this.addScalarLayer('pm25', this.pm25Data)

        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    tavgData () {
      console.log('sx')
      this.removeVectorLayer()
      if (this.baseLayerIndex == 10 && this.tavgFlag) {
        this.addScalarLayer('tavg', this.tavgData)
      } else {
        this.resetMapLayer();
      }
    },
    tpData () {
      this.removeVectorLayer()
      if (this.baseLayerIndex == 11 && this.tpFlag) {
        this.addScalarLayer('tp', this.tpData)

        //  this.addHeatmap(this.textData);
      } else {
        this.resetMapLayer();
      }
    },
    vectorAnimateSwitch () {
      // if (!this.vectorAnimateSwitch){
      this.toggleVectorLayer(this.vectorAnimateSwitch);
      // }
    },

  },
}
</script>
<style scoped lang="less">
.container {
  height: 100%;
  .contextmenu-tips {
    position: absolute;
    top: 0px;
    left: 0px;
    /*width: 200px;*/
    /*height: 200px;*/
    background-color: #fff;
    border-radius: 2px;
    overflow: hidden;
    p {
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #c3c3c3;
        color: #00a0e9;
      }
    }
  }
  .custom-tips {
    position: absolute;
    box-sizing: border-box;
    width: 190px;
    height: 93px;
    top: 100px;
    left: 100px;
    padding: 10px;
    color: #fff;
    // background-color: #ffffff;
    background-image: url("../../assets/myMap/border2.png");
    background-size: cover;
    background-repeat: no-repeat;
    // border: 2px solid #006fc6;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-size: 12px;
    .pos {
      display: flex;
      justify-content: space-around;
      justify-items: center;
      width: auto;
      .icon {
        background-image: url("../../assets/myMap/坐标.png");
        width: 25px;
        height: 25px;
        background-size: cover;
      }
      .value {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        color: #c3c3c3;
        text-align: center;
        font-size: 12px;
      }
    }
    span {
      vertical-align: baseline;
      display: inline-block;
      //   width: 160px;
      height: 35px;
      line-height: 35px;
      color: #fff;
      font-size: 14px;
    }
    &:after,
    &:before {
      border: solid transparent;
      content: " ";
      height: 0;
      top: 87%;
      position: absolute;
      width: 0;
    }

    &:after {
      border-width: 8px;
      border-top-color: #4e74cb;
      left: 90px;
    }
    p:last-of-type > span {
      height: 35px;
      line-height: 35px;
      color: #fff;
      font-size: 14px;
    }
  }
  .map {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .bg_canvas {
    width: 100%;
    display: none;
    position: absolute;
    z-index: 500;
    left: 0;
    top: 60px;
  }
}
.typhoon-logo {
  background: url("../../assets/typhoon-logo.gif") no-repeat;
  background-size: 100% 100%;
}
//
.warning-line-pop {
  /deep/ .el-icon-view {
    position: absolute;
    right: 9px;
    top: 16px;
  }
  p {
    /*display: flex;*/
    /*align-items: center;*/
    span {
      /*margin: 0 10px;*/
      margin-right: 10px;
      line-height: 15px;
      flex: auto;
      i {
        cursor: pointer;
        font-size: 20px;
      }
      i.disabled {
        color: #cccccc;
      }
    }
  }
}
/* 地 图 工具条*/
.map-tools {
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 1px 2px 5px rgba(11, 19, 28, 0.2s);
  position: absolute;
  right: 55px;
  top: 20px;
  transition: all 0.3s;
  .map-tools-bar-phone {
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 5px;
    top: 135px;
    background: #ffffff;
    zoom: 0.7;
    /*width: 70px;*/
    .vname {
      font-size: 12px;
      transform: scale(0.9);
    }
    img {
      margin-right: 0 !important;
      width: 20px !important;
      height: auto !important;
      margin-bottom: 3px;
    }
    li {
      padding: 4px 4px 4px 5px !important;
      box-sizing: border-box;
      border-right: none !important;
      span {
        padding: 2px 2px 4px 3px !important;
        border-bottom: 1px solid #e4e4e4;
      }
    }
    li:first-child {
      padding: 6px 4px 6px 5px !important;
    }
    li:last-child {
      padding: 3px 4px 3px 5px !important;
      border-bottom: none;
      span {
        border-bottom: none;
      }
    }
  }
  .map-tools-bar {
    > li {
      font-size: 12px;
      cursor: pointer;
      padding: 5px 8px;
      display: inline-block;
      border-right: 1px solid #cccccc;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 3px;
          width: 13px;
          height: 13px;
        }
      }
      &.active {
        /*background-color: #57a3f3;*/
        color: #0aa0e7;
      }
      &:hover {
        /*background-color: #0AA0E7;*/
        color: #0aa0e7;
      }
      &:hover > .children-tool-bar {
        display: block;
      }
      .children-tool-bar-phone {
        position: fixed !important;
        right: 60px !important;
        top: 140px !important;
        li {
          line-height: 20px !important;
        }
        .icon-arr {
          position: absolute;
          display: none;
          left: -61px !important;
          width: 120px;
          background-color: #fff;
          padding: 0;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          transform: translateY(62px);
        }
      }
      .children-tool-bar {
        padding-top: 10px;
        margin-top: -10px;
        display: none;
        position: absolute;
        top: 32px;
        margin-left: -8px;
        > li {
          background-color: #fff;
          color: #2c3e50;
          height: 28px;
          line-height: 28px;
          padding: 0 5px 0 10px;
          border-bottom: 0.5px solid #cccccc;
          &:hover {
            color: #0aa0e7;
          }
          span {
            > img {
              /*margin-right: 5px;*/
            }
            > span {
              margin-left: 5px;
            }
          }
          &.active {
            color: #0aa0e7;
          }
          &:hover {
            /*background-color: #0AA0E7;*/
            color: #0aa0e7;
          }
          .icon-arr {
            position: absolute;
            display: none;
            left: 94px;
            width: 175px;
            background-color: #fff;
            padding: 0;
            flex-wrap: wrap;
            > li {
              margin: 9px;
              border: 1px solid #c3c3c3;
              height: 40px;
              width: 40px;
              padding: 5px;
              img {
                width: 30px;
                height: 30px;
              }
              &:hover {
                border: 1px solid #00a0e9;
              }
            }
          }
        }
        li:nth-child(1) > .icon-arr {
          top: 10px;
        }
        li:nth-child(2) > .icon-arr {
          top: 38px;
        }
        li:nth-child(3) > .icon-arr {
          top: 66px;
        }
        li:nth-child(1):hover > .icon-arr {
          display: flex;
        }
        li:nth-child(2):hover > .icon-arr {
          display: flex;
        }
        li:nth-child(3):hover > .icon-arr {
          display: flex;
        }
      }
    }
    li:last-of-type {
      border-right: none;
    }
  }
}
.location-dialog {
  border-radius: 10px;
  .dialog-body {
    padding: 20px 20px 0 20px;
    text-align: center;
  }
  .dialog-header {
    position: absolute;
    right: 20px;
    top: 0;
    color: #ffffff;
    background-color: unset;
    border-radius: 5px 5px 0 0;
    p {
      height: 50px;
      line-height: 50px;
    }
  }
}

.latlng-form {
  .latlng-form-div {
    margin-bottom: 22px;
    .latlng-label {
      /*margin-right: 20px;*/
    }
    .latlng-input {
      width: 20%;
      margin-left: 10px;
      margin-right: 5px;
    }
  }
}

.text-marker {
  width: 100px !important;
  height: 30px !important;
  line-height: 30px;
  background-color: unset;
}
.icon-marker {
  width: 100px !important;
  height: 70px !important;
  line-height: 70px;
  background-color: unset;
  text-align: center;
  img {
    width: 40px;
    height: 40px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
    transition: all 5s;
  }
}
</style>
<style scoped lang="css">
.location-dialog >>> .el-dialog {
  border-radius: 5px;
}
.location-dialog >>> .el-dialog__header {
  padding: 0;
  background-color: #00479d;
  height: 50px;
  line-height: 50px;
  border-radius: 5px 5px 0 0;
}
.location-dialog >>> .el-dialog__title {
  margin-left: 20px;
  color: #ffffff;
}
.location-dialog >>> .el-dialog__body {
  padding: 0;
}
.location-dialog >>> .el-dialog__footer {
  padding: 0 20px 10px 20px;
  border-radius: 0 0 5px 5px;
}
.location-dialog >>> .el-color-picker__trigger {
  width: 185px;
  height: 44px;
}
.location-dialog >>> .el-input {
  width: 185px;
}
.arrow-icon {
  width: 30px;
  height: 30px;
  background-color: blue;
  transform: rotate(45deg);
}
.text-icon {
  width: 100px;
  height: 20px;
  color: #d81e06;
  line-height: 20px;
  font-size: 14px;
}

/* 遮罩图层 */
#mask-map {
  width: 100%;
}
</style>
<style >
.my-cluster {
  width: 24px;
  height: 24px;
  /*background-color: blue;*/
  text-align: center;
}
.my-cluster p {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  border-radius: 20px;
  text-shadow: #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
    #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
    #333333 0px 0px 2px;
}
.selectMap {
  position: absolute;
  top: 20%;
  right: 0.5%;
}
</style>
