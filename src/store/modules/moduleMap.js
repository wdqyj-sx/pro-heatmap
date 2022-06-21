const SET_LATLNG = "SET_LATLNG"; //经纬度
const SET_LAYER_FLAG = "SET_LAYER_FLAG"; // 设置数据请求flag
const SET_BASE_LAYER_INDEX = "SET_BASE_LAYER_INDEX" //图层索引
const SET_TAIR = "SET_TAIR"
const SET_QAIR = "SET_QAIR"
const SET_SO2MASS = "SET_SO2MASS"
const SET_WIND = "SET_WIND"
const SET_CL = "SET_CL"
// const SET_WIND_DATA = "SET_WIND_DATA" //风场数据
// const SET_AIR_PRESSURE_DATA = "SET_AIR_PRESSURE_DATA"; // 设置气压数据
// const SET_DSWRF = "SET_DSWRF"; //测试数据
// const SET_AQI = "SET_AQI"
// const SET_CO = "SET_CO"
// const SET_HUMIDITY = "SET_HUMIDITY"
// const SET_PM25 = "SET_PM25"
// const SET_TEMP = "SET_TEMP"
// const SET_TP = "SET_TP"
// const SET_TAVG = "SET_TAVG"
const SET_SHOW3D = "SET_SHOW3D"

// const SET_SEA_TEMPERATURE_DATA = "SET_SEA_TEMPERATURE_DATA"; // 设置海温数据
// const SET_WAVE_DATA = "SET_WAVE_DATA"; // 设置海浪数据
// const SET_CURRENT_DATA = "SET_CURRENT_DATA"; // 设置洋流数据
const SET_CURRENT_SHOW_DATA = "SET_CURRENT_SHOW_DATA" //设置当前显示数据
// import http from "@/http/index";
// import { getEarthWindInfo } from "../../http/mapLayer";
import { latlngChangeToDMS } from "../../utils/util";
//导入图标
// import windIcon from "@/assets/myMap/风场.png";
// import waveIcon from "@/assets/myMap/海浪.png";
// import seaTemperatureIcon from "@/assets/myMap/海温.png"
// import oceanCurrentIcon from "@/assets/myMap/洋流.png"
// import airPressureIcon from "@/assets/myMap/气压.png"
// import fushe from "@/assets/myMap/辐射.png"
// import kongqizhiliang from "@/assets/myMap/空气质量.png" 
// import co1 from "@/assets/myMap/一氧化碳.png"
// import xiangduishidu from "@/assets/myMap/相对湿度.png"
// import pm25Icon from "@/assets/myMap/pm2.5.png" 
// import wendu from "@/assets/myMap/温度.png"
// import jiangshuiliang from "@/assets/myMap/降水量.png"

// import temperatureIcon from "@/assets/myMap/气温.png"
// import demo from "../../mock/data"
// import LW from "../../mock/data/libwind.min"
import axios from "axios"
import tairIcon from "@/assets/myMap/气温.png"
import qairIcon from "@/assets/myMap/相对湿度.png"
import so2MassIcon from "@/assets/myMap/SO2.png"
import windIcon from "@/assets/myMap/风场.png"
import clIcon from "@/assets/myMap/cl.png"
export default {
    namespaced: true,
    state: {
        map: {
            titleLayers: [
                {
                    url: "https://www.google.cn/maps/vt?lyrs=s@804&gl=cn&x={x}&y={y}&z={z}",
                }, // 谷歌卫星
                {
                    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
                }, // 智图深蓝色
                {
                    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
                }, // 智图暖色
                {
                    url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
                }, // 智图灰色
                {
                    url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                }, // 高德矢量
            ],
            //   baseLayer: [
            //     {
            //       layerType: "setWindData",
            //       layerIcon: windIcon,
            //       layerName: "风场",
            //       active: false,
            //     },
            //     // {layerType:'setAirTemperatureData',layerIcon:temperatureIcon,layerName:'气温',active:false},
            //     {
            //       layerType: "setWaveData",
            //       layerIcon: waveIcon,
            //       layerName: "海浪",
            //       active: false,
            //     },
            //     {layerType:'setSeaTemperatureData',layerIcon: seaTemperatureIcon,layerName:'海温',active:false},
            //     {layerType:'setCurrentData',layerIcon: oceanCurrentIcon,layerName:'洋流',active:false},
            //     {layerType:'setAirPressureData',layerIcon: airPressureIcon,layerName:'气压',active:false},
            //     {layerType:'setDswrf',layerIcon:fushe,layerName:'辐射量',active:false},
            //     {layerType:'setAqi',layerIcon:kongqizhiliang,layerName:'水蒸气压',active:false},
            //     {layerType:'setCo',layerIcon:co1,layerName:'一氧化碳',active:false},
            //     {layerType:'setHumidity',layerIcon:xiangduishidu,layerName:'相对湿度',active:false},
            //     {layerType:'setPm25',layerIcon:pm25Icon,layerName:'PM2.5',active:false},
            //     {layerType:'setTavg',layerIcon:wendu,layerName:'温度',active:false},
            //     {layerType:'setTp',layerIcon:jiangshuiliang,layerName:'降水量',active:false}
            //     // {layerType:'setSaltData',layerIcon: salinityIcon,layerName:'盐度',active:false},
            //   ],
            baseLayer: [
                {
                    layerType: "setTair",
                    layerIcon: tairIcon,
                    layerName: "气温",
                    active: false,
                },
                {
                    layerType: "setQair",
                    layerIcon: qairIcon,
                    layerName: "相对湿度",
                    active: false,
                },
                {
                    layerType: "setSo2Mass",
                    layerIcon: so2MassIcon,
                    layerName: "so2",
                    active: false,
                },
                {
                    layerType: "setWind",
                    layerIcon: windIcon,
                    layerName: "风场",
                    active: false,
                },
                {
                    layerType:"setCl",
                    layerIcon:clIcon,
                    layerName:'cl-',
                    active:false
                }
            ],
            currentLat: 0.0,
            currentLng: 0.0,
            //数据图层
            baseLayerIndex: null,
            //   图层数据开关
            layerFlag: true,
            tairFlag: false,
            qairFlag: false,
            so2MassFlag: false,
            windFlag:false,
            clFlag:false,
            tairData: [],
            qairData: [],
            so2MassData: [],
            windData:[],
            clData:[],

            //   windFlag:false, // 风场开关
            //   windData:[],
            //   windHotData:[],
            //   waveFlag:false, // 海浪开关
            //   currentFlag:false, // 洋流开关
            //   seaTemperatureFlag:false, // 海温开关
            //   dswrfFlag:false,
            //   aqiFlag:false,
            //   coFlag:false,
            //   humidityFlag:false,
            //   pm25Flag:false,
            //   tempFlag:false,
            //   tavgFlag:false,
            //   tpFlag:false,
            //   waveData:null,
            //   waveHotData:null,
            //   currentData:null,
            //   currentHotData:null,
            //   airPressureData:null,
            //   seaTemperatureData:null,
            //   airTemperatureData:null,
            //   dswrfData:null,
            //   aqiData:null,
            //   coData:null,
            //   humidityData:null,
            //   pm25Data:null,
            //   tempData:null,
            //   tpData:null,
            //   tavgData:null,
            show3D: false,
            currentShowData: {
                data: '--',
                lat: '',
                lng: '',
                title: ''
            },
        },
        style: {
            vectorAnimateSwitch: true, // 全局 图层 矢量动画 开关

        }
    },
    mutations: {

        [SET_LATLNG] (state, payload) {
            state.map.currentLat = latlngChangeToDMS(payload.lat);
            state.map.currentLng = latlngChangeToDMS(payload.lng);
        },
        [SET_LAYER_FLAG] (state, payload) {
            state.map.layerFlag = payload;
        },
        [SET_BASE_LAYER_INDEX] (state, payload) {
            if (state.map.baseLayerIndex == payload.index && payload.flag) {
                state.map.baseLayerIndex = null
            } else {
                state.map.baseLayerIndex = payload.index
            }
            state.map.baseLayer[payload.index].active = !payload.flag
        },
        [SET_TAIR] (state, payload) {
            //控制 风场开关打开
            state.map.tairFlag = !payload.flag
            state.map.tairData = payload.data
            // state.map.windHotData = payload.hotData
        },
        [SET_QAIR] (state, payload) {

            state.map.qairFlag = !payload.flag
            state.map.qairData = payload.data
            // state.map.windHotData = payload.hotData
        },
        [SET_SO2MASS] (state, payload) {

            state.map.so2MassFlag = !payload.flag
            state.map.so2MassData = payload.data
            // state.map.windHotData = payload.hotData
        },
        [SET_WIND] (state, payload) {
            state.map.windFlag = !payload.flag
            state.map.windData = payload.data
            // state.map.windHotData = payload.hotData
        },
        [SET_CL] (state, payload) {
            state.map.clFlag = !payload.flag
            state.map.clData = payload.data
            // state.map.windHotData = payload.hotData
        },
        // [SET_WIND_DATA](state,payload){
        //     //控制 风场开关打开
        //     state.map.windFlag = !payload.flag
        //     //接受数据
        //     // console.log('setwinddata')
        //     // console.log(payload)
        //     state.map.windData = payload.data
        //     state.map.windHotData = payload.hotData
        // },
        // [SET_SEA_TEMPERATURE_DATA](state,payload){
        //     // console.log(payload)
        //   state.map.seaTemperatureFlag = !payload.flag;
        //   state.map.seaTemperatureData= payload.data;
        // },
        // [SET_WAVE_DATA](state,payload){
        //   state.map.waveFlag = !payload.flag;
        //   state.map.waveData = payload.data;
        //   state.map.waveHotData = payload.hotData;

        // },
        // [SET_CURRENT_DATA](state,payload){
        //   state.map.currentFlag = !payload.flag;
        //   state.map.currentData = payload.data;
        //   state.map.currentHotData = payload.hotData;
        // },
        //  [SET_AIR_PRESSURE_DATA](state,payload){
        //   state.map.airPressureFlag = !payload.flag;
        //   state.map.airPressureData = payload.data;
        // },
        // [SET_DSWRF](state,payload){
        //     state.map.dswrfFlag= !payload.flag;
        //     state.map.dswrfData = payload.data;

        // },
        // [SET_AQI](state,payload){
        //     state.map.aqiFlag= !payload.flag;
        //     state.map.aqiData = payload.data;

        // },
        // [SET_CO](state,payload){
        //     state.map.coFlag= !payload.flag;
        //     state.map.coData = payload.data;

        // },
        // [SET_HUMIDITY](state,payload){
        //     state.map.humidityFlag= !payload.flag;
        //     state.map.humidityData = payload.data;

        // },
        // [SET_PM25](state,payload){
        //     state.map.pm25Flag= !payload.flag;
        //     state.map.pm25Data = payload.data;

        // },
        // [SET_TAVG](state,payload){
        //     state.map.tavgFlag= !payload.flag;
        //     state.map.tavgData = payload.data;

        // },
        // // [SET_TEMP](state,payload){
        // //     state.map.tempFlag= !payload.flag;
        // //     state.map.tempData = payload.data;

        // // },
        // [SET_TP](state,payload){
        //     state.map.tpFlag= !payload.flag;
        //     state.map.tpData = payload.data;

        // },
        [SET_CURRENT_SHOW_DATA] (state, payload) {
            // console.log(payload)
            state.map.currentShowData.data = payload.showValue
            state.map.currentShowData.lat = payload.lat.toFixed(2)
            state.map.currentShowData.lng = payload.lng.toFixed(2)
            state.map.currentShowData.title = payload.titleName == '' ? '数据' : payload.titleName
        },
        [SET_SHOW3D] (state, payload) {
            let eventFlag = payload.eventFlag
            // console.log(payload)
            if (eventFlag == "二维") {
                state.map.show3D = false
            }
            if (eventFlag == '三维') {

                state.map.show3D = true
            }
            // console.log(state.map.show3D)
        }
    },
    actions: {

        // setWindData (context, payload) {

        //     if (!payload.flag) {
        //         //调整图层开关
        //         context.commit('SET_LAYER_FLAG', false)
        //         //
        //         context.commit('SET_BASE_LAYER_INDEX', payload)
        //         let dat = JSON.parse(demo.windData.data)
        //         payload.data = dat.dataJson
        //         context.commit('SET_WIND_DATA', payload)
        //         context.commit('SET_LAYER_FLAG', true)

        //     }
        //     else {
        //         payload.data = null
        //         payload.hotData = null
        //         context.commit('SET_WIND_DATA', payload)
        //         context.commit('SET_LAYER_FLAG', true)
        //         context.commit('SET_BASE_LAYER_INDEX', payload)
        //     }
        //     // console.log(payload)

        // },
        async setWind(context,payload){
            if(!payload.flag){
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG',false)
                let resdata = await axios.get("http://localhost:3000/wind",{
                    params:{
                        time:v
                    }
                })
                let data = resdata.data

                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    // console.log(totalData)

                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_WIND', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_WIND', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
            }
            else {
                        payload.data = null
                        payload.hotData = null
                        context.commit('SET_WIND', payload)
                        context.commit('SET_LAYER_FLAG', true)
                        context.commit('SET_BASE_LAYER_INDEX', payload)
                    }
        },
        async setTair (context, payload) {
            // console.log('sx')
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                
                // console.log(v)
                let resdata = await axios.get("http://localhost:3000/tair",{
                    params:{
                        time:v
                    }
                })
                let data = resdata.data

                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    // console.log(totalData)

                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_TAIR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_TAIR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
            }
            else {
                payload.data = null
                payload.hotData = null
                context.commit('SET_TAIR', payload)
                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setQair (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                
                let resdata = await axios.get("http://localhost:3000/qair",{
                    params:{
                        time:v
                    }
                })
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_QAIR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_QAIR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
            }
            else {
                payload.data = null
                payload.hotData = null
                context.commit('SET_QAIR', payload)
                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setSo2Mass (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                let resdata = await axios.get("http://localhost:3000/so2mass",{
                    params:{
                        time:v
                    }
                })
                
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    // console.log(totalData)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_SO2MASS', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_SO2MASS', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_SO2MASS', payload)
                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setCl (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                let resdata = await axios.get("http://localhost:3000/text",{
                    params:{
                        time:v
                    }
                })
                
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    // console.log(totalData)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_CL', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_CL', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_CL', payload)
                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        show3D (context, payload) {
            context.commit('SET_SHOW3D', payload)

        }
    },
    modules: {},
};
