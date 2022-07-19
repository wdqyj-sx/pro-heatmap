const SET_LATLNG = "SET_LATLNG"; //经纬度
const SET_LAYER_FLAG = "SET_LAYER_FLAG"; // 设置数据请求flag
const SET_BASE_LAYER_INDEX = "SET_BASE_LAYER_INDEX" //图层索引
const SET_TAIR = "SET_TAIR"
const SET_QAIR = "SET_QAIR"
const SET_SO2MASS = "SET_SO2MASS"
const SET_WIND = "SET_WIND"
const SET_CL = "SET_CL"
const SET_SSFLUXU = "SET_SSFLUXU"
const SET_SSFLUXV = "SET_SSFLUXV"
const SET_ICORR = "SET_ICORR"

const SET_SHOW3D = "SET_SHOW3D"


const SET_CURRENT_SHOW_DATA = "SET_CURRENT_SHOW_DATA" //设置当前显示数据

import { latlngChangeToDMS } from "../../utils/util";

import axios from "axios"
import tairIcon from "@/assets/myMap/气温.png"
import qairIcon from "@/assets/myMap/相对湿度.png"
import so2MassIcon from "@/assets/myMap/SO2.png"
import windIcon from "@/assets/myMap/风场.png"
import clIcon from "@/assets/myMap/cl.png"
import ssflux from "@/assets/myMap/ssflux.png"
import icorrIcon from "@/assets/myMap/金属.png"
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
                },{
                    layerType:"setSsfluxu",
                    layerIcon:ssflux,
                    layerName:"ssfluxu",
                    active:false
                },
                {
                    layerType:"setSsfluxv",
                    layerIcon:ssflux,
                    layerName:"ssfluxv",
                    active:false
                },
                {
                    layerType:'setIcorr',
                    layerIcon:icorrIcon,
                    layerName:"setIcorr",
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
            ssfluxuFlag:false,
            ssfluxvFlag:false,
            icorrFlag:false,
            icorrData:[],
            tairData: [],
            qairData: [],
            so2MassData: [],
            windData:[],
            clData:[],
            ssfluxuData:[],
            ssfluxvData:[],

          
            show3D: false,
            currentShowData: {
                data: '--',
                lat: '',
                lng: '',
                title: ''
            },
            currentData:null
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
        ['SET_CURRENT_DATA'](state,payload){
            state.map.currentData = payload
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
        [SET_SSFLUXU] (state, payload) {
            state.map.ssfluxuFlag = !payload.flag
            state.map.ssfluxuData = payload.data
            // state.map.windHotData = payload.hotData
        },
        [SET_SSFLUXV] (state, payload) {
            state.map.ssfluxvFlag = !payload.flag
            state.map.ssfluxvData = payload.data
            // state.map.windHotData = payload.hotData
        },
      [SET_ICORR](state,payload){
        state.map.icorrFlag = !payload.flag
        state.map.icorrData = payload.data
      },
        [SET_CURRENT_SHOW_DATA] (state, payload) {
            // console.log(payload)
            state.map.currentShowData.data = payload.showValue
            state.map.currentShowData.lat = payload.lat.toFixed(2)
            state.map.currentShowData.lng = payload.lng.toFixed(2)
            state.map.currentShowData.title = state.map.baseLayer[payload.baseLayerIndex].layerName
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
        },
        
        
    },
    actions: {

        setShowData (context, payload) {
                // console.log(context,payload)
                let res = {}
                let { lat, lng } = payload
                res.lat = lat
                res.lng = lng
                let currentData = payload.currentData
                let baseLayerIndex = payload.baseLayerIndex
              
                // res.layerType = payload.layerType
                // let layerDataName = ''
                // let titleName = ''
                // switch (layerType) {
                //     case 'setTair':
                //         layerDataName = 'windData'
                //         titleName = '气温'
                //         break;
                //     case 'setWaveData':
                //         layerDataName = 'seaWaveData'
                //         titleName = '海浪值'
    
                //         break;
                //     case 'setSeaTemperatureData':
                //         layerDataName = 'temperatureData'
                //         titleName = '海温值'
    
                //         break;
                //     case 'setCurrentData':
                //         layerDataName = 'seaCurrentData'
                //         titleName = '洋流值'
                //         break;
                //     case 'setAirPressureData':
                //         layerDataName = 'pressureData'
                //         titleName = '气压值'
                //         break;
                //     case 'SET':
                //         layerDataName = 'text'
                //         titleName = '测试'
                //         break;
                //     case 'setHumidity':
                //         layerDataName = 'humidity'
                //         titleName = '相对湿度'
                //         break;
                // }
                // if (layerDataName != '') {
                //     let file = demo[layerDataName].data
                //     // console.log(file)
                //     const dat = JSON.parse(file)
                //     // console.log(dat)
                //     let { header, data } = dat.dataJson[0]
                //     let { la1, lo1, dx, dy } = header
                //     //计算坐标所在栅格
                //     console.log(lat, lng)
                //     let row = Math.floor(Math.abs(lat - la1) / dx)
                //     let col = Math.floor(Math.abs(lo1 - lng) / dy)
                //     console.log(row, col)
                //     let index = row * dx + col
    
                //     // console.log(data)
                //     let showValue = data[index]
                //     console.log(showValue)
                //     res.showValue = showValue.toFixed(2)
                //     res.titleName = titleName
                //     // console.log(parseInt(showValue))
                //     context.commit('SET_CURRENT_SHOW_DATA', res)
                // }
                let {header,data} = currentData.data[0]
                let { la1, lo1, dx, dy } = header
                //     //计算坐标所在栅格
                    
                    let row = Math.floor(Math.abs(lat - la1) / dx)
                    let col = Math.floor(Math.abs(lo1 - lng) / dy)
                   
                    let index = Math.floor(row * dx + col)
                    let showValue = data[index]
                  
                    res.showValue = showValue.toFixed(2)
                    res.baseLayerIndex = baseLayerIndex
                    context.commit('SET_CURRENT_SHOW_DATA',res)
                    
            },

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
                    context.commit('SET_CURRENT_DATA',payload)
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
                       context.commit('SET_CURRENT_DATA',payload)

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
                    context.commit('SET_CURRENT_DATA',payload)

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
                context.commit('SET_CURRENT_DATA',payload)

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
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_QAIR', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
            }
            else {
                payload.data = null
                payload.hotData = null
                context.commit('SET_QAIR', payload)
                context.commit('SET_CURRENT_DATA',payload)

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
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_SO2MASS', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_SO2MASS', payload)
                context.commit('SET_CURRENT_DATA',payload)

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
                    console.log(totalData)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_CL', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_CL', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_CL', payload)
                context.commit('SET_CURRENT_DATA',payload)

                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setSsfluxu (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                let resdata = await axios.get("http://localhost:3000/ssfluxu",{
                    params:{
                        time:v
                    }
                })
                
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_SSFLUXU', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_SSFLUXU', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_SSFLUXU', payload)
                context.commit('SET_CURRENT_DATA',payload)

                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setSsfluxv (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                let resdata = await axios.get("http://localhost:3000/ssfluxv",{
                    params:{
                        time:v
                    }
                })
                
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_SSFLUXV', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_SSFLUXV', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_SSFLUXV', payload)
                context.commit('SET_CURRENT_DATA',payload)

                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        async setIcorr (context, payload) {
            if (!payload.flag) {
                let v = payload.time
                if(!v){
                    v = 0
                }
                context.commit('SET_LAYER_FLAG', false)
                let resdata = await axios.get("http://localhost:3000/icorr",{
                    params:{
                        time:v
                    }
                })
                
                let data = resdata.data
                if (data.code == 0) {
                    let totalData = JSON.parse(data.data)
                    payload.data = totalData
                    context.commit('SET_BASE_LAYER_INDEX', payload)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_ICORR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                }
                else {
                    payload.data = []
                    context.commit('SET_ICORR', payload)
                    context.commit('SET_LAYER_FLAG', true)
                    context.commit('SET_CURRENT_DATA',payload)

                    context.commit('SET_BASE_LAYER_INDEX', payload)

                }
                
            }
            else {
                payload.data = null
                // payload.hotData = null
                context.commit('SET_ICORR', payload)
                context.commit('SET_LAYER_FLAG', true)
                context.commit('SET_CURRENT_DATA',payload)

                context.commit('SET_BASE_LAYER_INDEX', payload)
            }
        },
        show3D (context, payload) {
            context.commit('SET_SHOW3D', payload)

        }
    },
    modules: {},
};
