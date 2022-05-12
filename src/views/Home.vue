<template>
   <div class="home">
        <leaflet-map/>
        <!-- <map-control/> -->
    <map-control/>
   </div>
</template>
<script>
import { isMobile } from "../utils/util"
    import LeafletMap from "../components/map/LeafletMap.vue"
    import MapControl from "../components/map/MapLayerControl.vue"
export default {
    /* eslint-disable */
    name:"Home",
    components:{
        LeafletMap,
        MapControl
    },
    return() {
        isMobile:isMobile()
    },
    created(){
        this.isMobile = isMobile()
    }
}
</script>
<style>
.el-collapse-item__content {
  color: white !important;
}
</style>
<style scoped>
.home>>>.el-collapse-item__header{
  height: 40px;
  line-height: 40px;
  font-size: 12px !important;
}
</style>