export default {
    map:{
        zoom:5,
        minZoom:4,
        maxZoom:10,
        center:[12.583623,116.286986],
        heatmapConfg:{ // 热力图配置
            'radius': 0.4,
            'maxOpacity': 0.75,
            "minOpacity":0,
            'scaleRadius': true,
            'useLocalExtrema': false,
            'blur':1,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            gradient: {
              "0": "rgba(90,86,143,1)",
              "0.1": "rgba(72,104,181,1)",
              "0.2": "rgba(69,151,168,1)",
              "0.3": "rgba(81,180,98,1)",
              "0.4": "rgba(106,192,82,1)", // 颜色过渡
              "0.5": "rgba(177,209,67,1)", // 颜色过渡
              "0.6": "rgba(215,206,60,1)", // 颜色过渡
              "0.7": "rgba(214,172,64,1)", // 颜色过渡
              "0.8": "rgba(213,137,72,1)", // 颜色过渡
              "0.85": "rgba(205,94,93,1)", // 颜色过渡
              "0.9": "rgba(144,28,79,1)", // 颜色过渡
              "0.99": "rgba(43,0,1,1)" // 颜色过渡
            }
          },
    },
    baseURL: process.env.VUE_APP_BASE_URL ,
   
}