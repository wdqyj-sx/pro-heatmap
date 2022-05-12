
// import moment from "moment"
// 判断是否为移动端
export const isMobile = () => {
    return  navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  }

  //经纬度转换成度分秒

export const latlngChangeToDMS = (value) => {
    if (value == ''){
      return ['','','']
    }else{
      if(!isNaN(Number(value))){
        value = Math.abs(value);
        var v1 = Math.floor(value);//度
        var v2 = Math.floor((value - v1) * 60);//分
        var v3 = Math.round((value - v1) * 3600 % 60);//秒
        return [v1 ,v2, v3 ];
      }
    }
  
  }

// 格式化 时间轴 小时 和 星期

export const formatDateForTimeline = (date,t) => {
    // const n = t || 24 * 7
    // const D = date || '2018/03/01'
    // const D1 = moment(new Date()).add('year',0).format("YYYY/MM/DD")
    // let arr = {},arr1 = {},arr2 = []
    // let d = new Date(new Date(D).toLocaleDateString()).getTime();
    // let d1 = new Date(new Date(D1).toLocaleDateString()).getTime();
    // for (let i = 0; i <= n; i++) {
    //   // let obj = {};
    //   arr[i] = d.toString();
    //   arr1[i] = d1.toString();
    //   if(i != 0 && i % 23 == 0){
    //     arr2.push(moment(new Date(+arr[i])).format('MM/DD')) // 显示年月日
    //     // arr2.push(WEEKS[new Date(d).getDay()])
    //   }
    //   d += 3600000;
    //   d1 += 3600000;
    // }
    const n = t|| 12
    const D=date || '2018/01/01'
    let mon = D.split('/')
    let arr={},arr1={}

    for(let i = 0;i<n;++i){
        if(i<10){
             mon[1] = `0${i+1}`
        }else {
            mon[1] = `${i+1}`
        }
        let d = new Date(new Date(mon.join("/")).toLocaleDateString()).getTime()
        // console.log(new Date(new Date(mon.join("/")).toLocaleDateString()))
        arr[i] = d
        arr1[i] = `${i+1}月`
    }
    // console.log(arr)
    // let d = new Date(new Date(D).toLocaleDateString())
    // console.log('sx')
    // console.log(d)
    // console.log(d.getTime())
    return {
        time:arr,
        week:arr1
    }

    // return {
    //   time:arr,  // 最小时间间隔
    //   time1: arr1,
    //   week:arr2 // 星期几
    // }
  }