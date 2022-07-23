<template>
  <div
    class="map-layer"
    :class="{ 'map-layer-phone': isMobile }"
    :style="{ 'margin-top': !showMoreFlag ? marginTop : moreMarginTop }"
  >
    <!-- 显示经纬度 -->
    <div class="map-tips">
      <div class="lat-lng-tips" :class="{ 'lat-lng-tips-phone': isMobile }">
        <span
          >纬度:<b
            >{{ currentLat[0] }}°{{ currentLat[1] }}'{{ currentLat[2] }}"</b
          ></span
        >
        <span
          >经度:<b
            >{{ currentLng[0] }}°{{ currentLng[1] }}'{{ currentLng[2] }}"</b
          ></span
        >
        <!--        <span>水深:<b>{{currentDeep}}</b>米</span>-->
      </div>
    </div>
    <!-- 显示图层控件 -->
    <div
      class="map-layer-control"
      :class="{ 'map-layer-control-phone': isMobile }"
      v-if="!isMobile"
    >
      <!-- 基础图层 -->
      <ul class="layer-control-ul">
        <li
          v-for="(item, index) in baseLayer"
          :key="index"
          :class="[baseLayerIndex == index && item.active ? 'active' : '']"
          @click="toggleBaseLayerV1(item, index)"
        >
          <i><img :src="item.layerIcon" alt="" /></i>
          <span v-show="!isMobile">{{ item.layerName }}</span>
        </li>
      </ul>
    </div>
    <!-- 图层线及图层图例 -->
    <div
      class="map-time-legend"
      :class="{ 'map-time-legend-phone': isMobile }"
      :style="{ width: TimeLineWidth-100 + 'px' }"
      v-show="showTimeLine"
    >
      <div class="time-line" :class="{ 'time-line-phone': isMobile }">
        <div class="time-line-picker" v-show="!isMobile">
          <el-date-picker
            v-model="historyDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="changeHistoryDate"
            @blur="togglePickerIcon"
            @focus="togglePickerIcon"
          >
          </el-date-picker>
          <i
            class="picker-icon"
            :class="[
              datePickerActive ? 'el-icon-arrow-down' : 'el-icon-arrow-up',
            ]"
          ></i>
        </div>
        <div class="time-line-icon">
          <i @click="playTimeLine" v-if="!timeFlag"
            ><img :src="playIcon" alt=""
          /></i>
          <i @click="stopTimeLine" v-else><img :src="pauseIcon" alt="" /></i>
        </div>
        <div class="time-line-slider" @mouseover="showTimelineTips">
          <div
            class="custom-tips"
            :style="customTips.style"
            v-show="customTips.show"
          >
            {{ customTips.text }}
          </div>
          <el-slider
            v-model="timeValue"
            :max="timeLineMax"
            :format-tooltip="formatTimelineTips"
            :show-stops="false"
            @change="changeTimeLine"
          ></el-slider>
          <div class="date-line">
            <span v-for="(v, index) in timeLineData.week">{{ v }}</span>
          </div>
        </div>
      </div>

      <div class="map-legend" :class="{ 'map-legend-phone': isMobile }">
        <div class="legend-bg" :class="'layer' + baseLayerIndex">
          <span v-for="(v, index) in baseMapLayerLegend[baseLayerIndex]">{{
            v
          }}</span>
        </div>
      </div>
    </div>
    <!-- 显示搜索框 -->
    <div class="search-map">
      <el-autocomplete
        class="inline-input"
        v-model="pos"
        :fetch-suggestions="querySearch"
        placeholder="请输入地址"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
    </div>
  
  </div>
</template>

<script>
import { mapState } from "vuex";
// import {  autocomplete } from "element-ui"
import { isMobile, formatDateForTimeline } from "../../utils/util";
import playIcon from "@/assets/myMap/播放.png";
import pauseIcon from "@/assets/myMap/暂停.png";
import moment from 'moment'
import axios from "axios"

export default {
  name: "MapControl",

  data () {
    return {
      isMobile: isMobile(),
      showMoreFlag: false,
      // 计算页面 高度
      marginTop: document.documentElement.clientHeight / 2 - 180 + "px",
      moreMarginTop: document.documentElement.clientHeight / 2 + 20 + "px",
      // 计算页面宽度
      clientWid: document.documentElement.offsetWidth,
      l: 0,
      r: 0,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date('2018/1/1').getTime() || time.getTime() > new Date('2020/3/31').getTime();
        },
      },
      datePickerActive: false,
      timeFlag: false,
      playIcon: playIcon,
      pauseIcon: pauseIcon,
      customTips: { // 自定义 时间 提示
        text: '',
        style: '',
        show: false
      },//
      timeValue: [0],
      timeLineMax: 168,
      timeLineData: formatDateForTimeline('2021/1/1'),
      baseMapLayerLegend: [
        ['℃', -45, -30, -15, 0, 15, 30, 45],
        // ['°C',-20,-10,0,10,20,30,40],
        ['%', 0, 0.2, 0.4, 0.6, 0.8, 1],
        ['μg.m-3', 0, 0.08, 0.8, 8, 80],
        ['m/s', 1, 4, 7, 10, 13,16,19],
        ['mg/m2', 5, 7, 9, 11, 13,15],
        ['g/m.s',-1.5,-1,-0.5,0,0.5,1,1.5,2],
        ['g/m.s',-0.2,-0.15,-0.1,-0.05,0,0.05,0.1],
        ['level', 1,2,3,4,5]

        // ['m/s', 0, 0.1, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
        // ['hPa', 995, 1001, 1007, 1013, 1019, 1025],
        // ['kJ m-2 day-1', 10000, 20000, 30000, 40000, 50000, 60000],
        // ['bar', 30, 60, 90, 120, 150, 250],
        // ['mg/m³', 0.001, 0.003, 0.005, 0.008, 0.1, 0.2],
        // ['%', 22.3, 24.8, 27.4, 29.9, 32.5, 35.0],
        // ['%', 22.3, 24.8, 27.4, 29.9, 32.5, 35.0],
        // ['℃', -45,-30,-15,0,15,30,45],
        // ['mm', 0, 10, 30, 80,120,180]
      ],
      historyDate: new Date('2021/1/1'),
      pos: '',

    }
  },
  computed: {
    ...mapState("moduleMap", {
      currentLat: (state) => state.map.currentLat,
      currentLng: (state) => state.map.currentLng,
      baseLayer: (state) => state.map.baseLayer,
      baseLayerIndex: (state) => state.map.baseLayerIndex,
      layerFlag: (state) => state.map.layerFlag,
      //宽度计算
      TimeLineWidth () {
        if (this.isMobile) {
          return this.clientWid - this.l - this.r - 25;
        } else {
          return this.clientWid - this.l - this.r - 40;
        }
      },
      //是否显示时间条
      showTimeLine () {
        let flag = false;
        let { baseLayer } = this;
        for (let i = 0; i < baseLayer.length; i++) {
          if (baseLayer[i].active) {
            flag = true;
            break;
          }
        }
        return flag;
        // return true
      },
    }),
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getRightAndLeft()
      }, 300)
    })


  },
  methods: {
    //切换 图层
    toggleBaseLayerV1 (item, index) {
      console.log(item,index)
      this.stopTimeLine()
      if (!this.layerFlag) {
        this.$message({
          message: "正在渲染当前图层",
          type: "warning",
        });
        return false;
      } else {
        if (index == this.baseLayerIndex) {
          this.$store.dispatch("moduleMap/" + item.layerType, {
            flag: item.active,
            index: index,
          });
        } else {
        //   let activeItem = index != null ? this.baseLayer[index] : null;
        //   if (activeItem) {
            
        //     this.$store.dispatch("moduleMap/" + activeItem.layerType, {
        //       flag: false,
        //       index: index,
        //     });
        //   }
          this.changeTimeLine(this.timeValue, index)

        }
      }

    },
    // 获取左右边栏 宽度
    getRightAndLeft () {
      this.l = document.querySelector('.leftSlideBox') ? document.querySelector('.leftSlideBox').offsetWidth : 0
      this.r = document.querySelector('.rightSlideBox') ? document.querySelector('.rightSlideBox').offsetWidth : 0
    },
    changeHistoryDate (e) {
      this.timeLineData = formatDateForTimeline(new Date(e).toLocaleDateString())
      this.timeValue = 0
      this.inputTimeLine(this.timeValue)
      this.stopTimeLine();
    },
    togglePickerIcon () {
      this.datePickerActive = !this.datePickerActive
    },
    stopTimeLine () {
      this.timeFlag = false
      if (this._t) {
        clearInterval(this._t)
      }
    },
    showTimelineTips () {
      $('.el-slider__runway').mousemove((e) => {
        let lineWdith = e.target.getBoundingClientRect().width,
          lineOffsetX = e.target.getBoundingClientRect().x,
          mouseX = e.clientX,
          mouseY = e.clientY,
          w = mouseX - lineOffsetX
        let n = (lineWdith / 168).toFixed(2)
        let v = Math.floor(w / n / 14)
        // console.log(v)

        this.customTips.text = moment(+this.timeLineData.time[v]).format('MM') + '月'
        this.customTips.style = `left:${mouseX - lineOffsetX + 145}px;top:-30px`
        // console.log(this.customTips)
        // this.customTips.y = mouseY
      })
      $('.el-slider__runway').mouseover(() => {
        this.customTips.show = true
      })
      $('.el-slider__runway').mouseout(() => {
        this.customTips.show = false
      })
    },
    formatTimelineTips (v) {
      // console.log(v)
      let len = Math.floor(v / 14)
      return (moment(+this.timeLineData.time[len]).format('MM'));
    },
    changeTimeLine (e, index) {
      let n = !isNaN(index) ? index : this.baseLayerIndex
      if (n != null) {
        let tt = 0
        tt = e
        this.timeValue = tt;
        this.inputTimeLine(this.timeValue, index)

      }

    },
    playTimeLine () {
      //   let tt = this.baseLayerIndex == 0 || this.baseLayerIndex == 3 ? 5000 : 1500
      let tt = 1500
      this.timeFlag = true
      
      //   console.log(tt)
      //   console.log(this.timeValue)
      this._t = setInterval(() => {

        let { timeValue, timeLineMax } = this
        if (timeValue >= timeLineMax) {
          this.stopTimeLine()
        //   return false
            // this.timeValue = 0
        } else {
          this.timeValue = parseInt(timeValue) + 14
        //   console.log(timeValue)
          this.inputTimeLine(this.timeValue, this.baseLayerIndex)
          // console.log(this.timeValue)
        }
      }, 5000)
    },
    inputTimeLine (v, i) {
     
      let index = i != null ? i : this.baseLayerIndex
      let item = this.baseLayer[index]
      this.$store.dispatch('moduleMap/' + item.layerType, { flag: false, time: Math.floor(v/14), index: index })
    },
    async querySearch (queryString, cb) {
      try {
        let data = await axios.get(`http://api.tianditu.gov.cn/search?postStr={"keyWord":"${queryString}","level":"15","mapBound":"116.40569,39.91088,116.45119,39.93542","queryType":"7","count":"5","start":"0","queryTerminal":"10000"}&type=query&tk=ffd0e61d238085c62d54bf80db7b8a72`)
        let ans = data.data.pois
        let result = ans.map(pos => {
          // console.log(pos)
          return {
            value: pos.name,
            address: pos.address,
            latlon: pos.lonlat
          }
        })
        cb(result)
      }
      catch (e) {
        this.$message({
          message: '地点模糊',
          type: 'warning'
        })
      }

    },
    handleSelect (pos) {
      let latlon = pos.latlon.split(' ')
      // console.log(latlon)
      // console.log(window.map)
      window.map.setView([latlon[1], latlon[0]], 14)
    },
  

  },
  created () {
    this.isMobile = isMobile()
  },

};
</script>
<style type="css" scoped>
.time-line-slider >>> .el-slider__runway {
  background-color: rgba(2, 2, 2, 0.5) !important;
}
.time-line-picker >>> .el-input__prefix {
  display: none;
}
.time-line-picker >>> .el-input__inner {
  border-radius: 20px;
  background-color: #00a0e9;
  padding: 0 0 0 10px;
  text-shadow: 0 0 0 #ffffff;
  border: none;
  outline: none;
  height: 34px;
  cursor: pointer;
  color: transparent;
}
.time-line-picker >>> .el-date-editor.el-input {
  width: 120px;
  border-radius: 20px;
  background-color: #00a0e9;
  border: none;
}
</style>
<style scoped lang="less">
.map-layer {
  border-radius: 50px;
  width: 30px;
  float: left;
  margin-left: 30px;
  background-color: rgba(2, 2, 2, 0.5);
  .map-tips {
    transition: all 0.3s;
    position: absolute;
    top: 90%;
    .lat-lng-tips {
      margin-left: -20px;
      float: left;
      color: #ffff;
      text-shadow: #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
        #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
        #333333 0px 0px 2px;
      span {
        margin-left: 10px;
      }
    }
  }
  .map-layer-control {
    color: #ffffff;
    .layer-control-ul {
      li.active {
        i {
          background-color: #00a0e9;
          box-shadow: #333333 0px 2px 2px;
        }
        span {
          background-color: rgba(2, 2, 2, 0.5);
        }
      }
      li {
        cursor: pointer;
        font-size: 14px;
        width: 120px;
        height: 30px;
        display: flex;
        align-items: center;
        &:hover i {
          transition: all 0.3s;
          background-color: #e60012;
          box-shadow: #333333 0px 2px 2px;
        }
        &:hover span {
          transition: all 0.3s;
          background-color: rgba(2, 2, 2, 0.2);
        }
        i {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            // width: 50%;
            height: 50%;
          }
        }
        span {
          font-weight: 400;
          margin-left: 10px;
          padding: 2px 10px;
          border-radius: 20px;
          text-shadow: #333333 0px 0px 2px, #333333 0px 0px 2px,
            #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
            #333333 0px 0px 2px, #333333 0px 0px 2px;
        }
      }
    }
  }
  .map-time-legend-phone {
    left: 5px !important;
    bottom: -50px !important;
  }
  .time-line-phone {
    position: relative;
    /*bottom: -87px;*/
    zoom: 0.8;
  }
  .map-legend-phone {
    /*position: absolute;*/
    /*top: -31px;*/
    left: 0px;
    /*transform: rotate(90deg);*/
    position: fixed;
    bottom: -11px;
    /*right: -100px;*/
    width: 100vw !important;
    /*height: 0px !important;*/
    /*zoom: .8;*/
  }
  .map-legend-phone .legend-bg {
    zoom: 0.85 !important;
    font-size: 10px;
    border-radius: 0 !important;
    margin-left: 0 !important;
  }
  .map-legend-phone span {
    /*transform: rotate(-90deg);*/
    font-size: 12px !important;
  }
  .map-time-legend {
    position: absolute;
    transition: all 0.3s;
    bottom: 0;
    margin-left: -3px;
    display: flex;
    align-items: flex-end;
    .time-line {
      flex: 1;
      display: flex;
      .time-line-picker {
        width: 130px;
        position: relative;
        .picker-icon {
          width: 20px;
          height: 20px;
          background: #ffffff;
          color: #00a0e9;
          border-radius: 50%;
          line-height: 20px;
          text-align: center;
          position: absolute;
          top: 7px;
          right: 17px;
          transition: all 0.5s;
        }
      }
      .time-line-icon {
        cursor: pointer;
        /*font-size: 40px;*/
        margin-right: 15px;
        color: #009dff;
        /*float: left;*/
        /*background-color: #fff;*/
        img {
          width: 34px;
          height: 34px;
        }
      }
      .time-line-slider {
        flex: 1;
        .custom-tips {
          position: absolute;
          padding: 2px 15px;
          top: 0;
          left: 0;
          border-radius: 15px;
          border: none;
          color: black;
          background-color: #ffffc8;
          /*&:after, &:before {*/
          /*  border: solid transparent;*/
          /*  content: ' ';*/
          /*  height: 0;*/
          /*  top: 100%;*/
          /*  position: absolute;*/
          /*  width: 0;*/
          /*}*/

          /*&:after {*/
          /*  border-width: 8px;*/
          /*  border-top-color: #FFFFC8;*/
          /*  left: 26px;*/
          /*}*/
        }
        /*margin-left: 15px;*/
      }
      .date-line {
        margin-top: -18px;
        display: flex;
        span {
          flex: 1;
          display: flex;
          color: #ffffff;
          font-weight: 400;
          text-align: center;
          vertical-align: bottom;
          border-left-width: 1px;
          border-left-color: #2f332a;
          border-left-style: solid;
          text-shadow: #333333 0px 0px 2px, #333333 0px 0px 2px,
            #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
            #333333 0px 0px 2px, #333333 0px 0px 2px;
          justify-content: center;
          align-items: end;
        }
      }
    }
    .map-legend {
        position: absolute;
        right: -7%;
        bottom: 5px;
      width: 30px;
      height: 300px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .legend-bg {
        transition: all 0.3s;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 5px;
        justify-content: center;
        // margin-left: 20px;
        // box-shadow: 0px 2px 4px #2f332a;
        padding: 5px 5px;
        span {
            display: block;
            word-wrap: break-word;
            width: 32px;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          flex: 1;

          /*padding-left: 10px;*/
        }
      }

      .layer0 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer1 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer2 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer3 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer4 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer5 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
      .layer6,
      .layer7,
      .layer8,
      .layer9,
      .layer10,
      .layer11 {
        background: linear-gradient(
          to bottom,
          rgba(90, 86, 143, 1),
          rgba(72, 104, 181, 1),
          rgba(69, 151, 168, 1),
          rgba(81, 180, 98, 1),
          rgba(106, 192, 82, 1),
          rgba(177, 209, 67, 1),
          rgba(215, 206, 60, 1),
          rgba(214, 172, 64, 1),
          rgba(213, 137, 72, 1),
          rgba(205, 94, 93, 1),
          rgba(144, 28, 79, 1),
          rgba(43, 0, 1, 1)
        );
      }
    }
  }
  .search-map {
    position: absolute;
    top: 5%;
    right: 20px;
    width: 18%;
    height: 50px;
  }
}
.map-layer-phone {
  margin-left: 12px;
  position: absolute;
  bottom: 72px;
}
.map-layer-control-phone {
  zoom: 0.88;

  .layer-control-ul1 {
    li.active {
      i {
        background-color: #00a0e9;
        box-shadow: #333333 0px 2px 2px;
      }

      span {
        background-color: rgba(2, 2, 2, 0.5);
      }
    }

    li {
      cursor: pointer;
      font-size: 14px;
      /*width: 120px;*/
      height: 30px;
      display: flex;
      align-items: center;
      width: auto !important;
      display: flex;
      /*&:hover i {*/
      /*  transition: all .3s;*/
      /*  background-color: #e60012;*/
      /*  box-shadow: #333333 0px 2px 2px;*/
      /*}*/

      /*&:hover span {*/
      /*  transition: all .3s;*/
      /*  background-color: rgba(2, 2, 2, 0.2);*/
      /*}*/

      i {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          // width: 50%;
          height: 50%;
        }
      }

      span {
        font-weight: 400;
        margin-left: 10px;
        padding: 2px 10px;
        border-radius: 20px;
        text-shadow: #333333 0px 0px 2px, #333333 0px 0px 2px,
          #333333 0px 0px 2px, #333333 0px 0px 2px, #333333 0px 0px 2px,
          #333333 0px 0px 2px, #333333 0px 0px 2px;
      }
    }
  }
}
.map-layer-control-phone i {
  zoom: 0.88;
  /*margin-left: 2.3%;*/
  margin: auto;
}
.lat-lng-tips-phone {
  position: fixed;
  top: 133px;
  left: 17px;
  zoom: 0.7;
}

</style>
