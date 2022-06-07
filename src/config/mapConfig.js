import tairIcon from "@/assets/myMap/气温.png"
import qairIcon from "@/assets/myMap/相对湿度.png"
import so2MassIcon from "@/assets/myMap/SO2.png"


export default {
    setData: {
        SET_TAIR: "SET_TAIR",
        SET_QAIR: "SET_QAIR",
        SET_SO2MASS: "SET_SO2MASS"
    },
    setDataIcon: {
        tairIcon,
        qairIcon,
        so2MassIcon
    },
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
    ]
}