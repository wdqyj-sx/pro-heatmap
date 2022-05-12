import config from "../config"
import axios from "axios"
import {} from "element-ui"
// import store  from "@/store"


axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;  //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
axios.defaults.headers.common['Authorization'] = ''; // 设置请求头为 Authorization
axios.defaults.timeout = config.httpTimeout; // 请求的失效时间

export default {
    get(url,params){
        axios.defaults.baseURL = config.baseURL
        try{
            return new Promise((resolve,reject)=>{
                axios.get(url,{
                    params:params
                }).then(d=>{
                    resolve(d.data)
                })
                .catch(err=>{
                    reject(err)
                })
            })
        }
        catch(e){
            console.log(e)
        }
    }
}