import axios from "axios";
import { ElMessage } from "element-plus";
import config from '@/config'

const service =axios.create({
  baseURL:config.baseApi,
});

const NETWORK_ERROR = 'network_error .....';

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(
    (res)=>{
        const {code,data,msg} = res.data
        if(code === 200){
            return data;
        }else{
            const NETWORK_ERROR = 'network_error .....';
            ElMessage.error(msg || NETWORK_ERROR);
            return Promise.reject(msg || NETWORK_ERROR);
        }
    }
  );

  function request(options){
    options.method = options.method || "get";
    // about get attr adjust
    if(options.method.toLowerCase() === 'get'){
      options.params = options.data;
    }

    // mock 開關做一個處理
    let isMock = config.mock; //in config.index.js mock is false
    if(typeof options.mock !== 'undefined'){
      isMock = options.mock; //options.mock is true
    }

    //針對環境的處理
    if(config.env === 'prod'){
      //no mock
      service.defaults.baseURL = config.baseApi;
    }else{
      service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }
    return service(options);
  }

  export default request;