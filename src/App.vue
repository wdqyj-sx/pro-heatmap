<template>
  <div id="app">
    <!-- <leaflet-map/> -->
    <Home/>
  </div>
</template>

<script>

// import LeafletMap from "./components/map/LeafletMap.vue"
import Home from "./views/Home.vue"

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="less">
    #app {
        font-family: "Microsoft YaHei", "微软雅黑";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        // text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
<style>
    .el-menu.el-menu--horizontal {
        border-bottom: 0 none !important;
    }

    .el-menu--horizontal > .el-menu-item {
        height: 32px !important;
        line-height: 24px !important;
        font-size: 16px;
        margin-top: 14px !important;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
        background-color: #00a0e9 !important;
        border-radius: 16px;
    }

    .el-collapse-item__header {
        background-color: #00479d !important;
        color: #fff !important;
        font-size: 14px !important;
        border-bottom: 1px solid #1d2088 !important;
    }

    .el-collapse-item__wrap {
        background-color: unset !important;
        border-bottom: 0 none !important;
    }

    .el-collapse {
        border-bottom: 0 none !important;
    }

    .leftSlideBox .el-form-item__label {
        color: #fff !important;
        font-size: 12px;
        padding-right: 0;
    }

    .leftSlideBox .el-form-item {
        margin-bottom: 0;
    }

    .leftSlideBox .el-collapse-item__content {
        padding-bottom: 0;
    }

    .el-menu.el-menu--horizontal {
        border-bottom: 0 none !important;
    }

    .el-menu--horizontal > .el-menu-item {
        height: 32px !important;
        line-height: 24px !important;
        font-size: 16px;
        margin-top: 14px !important;
        border-radius: 16px;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
        background-color: #00a0e9 !important;
        border-radius: 16px;
    }

    .el-collapse-item__header {
        background-color: #00479d !important;
        color: #fff !important;
        font-size: 14px !important;
        border-bottom: 1px solid #1d2088 !important;
    }

    .el-collapse-item__wrap {
        background-color: unset !important;
        border-bottom: 0 none !important;
    }

    .el-collapse {
        border-bottom: 0 none !important;
    }

    .leftSlideBox .el-form-item__label {
        color: #fff !important;
        font-size: 12px;
        padding-right: 0;
    }

    .leftSlideBox .el-form-item {
        margin-bottom: 0;
    }

    .leftSlideBox .el-collapse-item__content {
        padding-bottom: 0;
    }
    .ivu-checkbox-wrapper {
        font-size: 12px !important;
        margin-bottom: 5px;
    }
    .el-popup-parent--hidden {
      padding-right: 0 !important;
    }
</style>
<style scoped>

</style>

