import axios from 'axios'
import {ElMessage} from 'element-plus'
 
// 配置axios实例
const service = axios.create({
    baseURL: '/api', //请求前缀
    timeout: 5000   //超时时间
})
//请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers['token'] = token
        }
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)


//响应拦截器
service.interceptors.response.use(
    (response) => {
        // 在发送请求之前做些什么
        const{ data , config } = response
        //处理业务状态码
        if(data.code == 200){
            return data.data
        } else {
            //超时
            if(data.code === '-1'){
                if(!Login.url?.includes('/login')){
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                //清楚登录信息
                localStorage.removeItem('token')
                //清楚用户信息
                localStorage.removeItem('userInfo')
                window.location.href = '/auth/login'                
                }
            }else{
                ElMessage.error(data.msg || '登录过期，请重新登录')
                return Promise.reject('网络请求失败...')
            }
        }
        return response
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

export default service
