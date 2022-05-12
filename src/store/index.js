import Vue from "vue"
import Vuex from "vuex"

import moduleMap from "./modules/moduleMap"

Vue.use(Vuex)

export default new Vuex.Store({
    state:{},
    mutations:{},
    actions:{},
    modules:{
        moduleMap:moduleMap
    }
})