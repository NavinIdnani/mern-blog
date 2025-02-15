
import axios from "axios";

import { API_NOTIFICATION_MESSAGES ,SERVICE_URLS} from "../constants/config";
import { getAccessToken,getType } from "../utils/common-utils";

const API_URL= import.meta.env.VITE_API_BASE_URL || '';
// || 'http://localhost:8000'
const axiosInstance=axios.create({
    baseURL:API_URL,
    timeout:20000,
    headers:{
        "Accept": "application/json,form-data", 
        "Content-Type": "application/json"
        
    }
})

axiosInstance.interceptors.request.use(
    function(config){
        if(config.TYPE){
            if(config.TYPE.params || config.TYPE.query){
                if(config.TYPE.params){
                    config.params=config.TYPE.params;
                }else if(config.TYPE.query){
                    config.url=config.url + '/' + config.TYPE.query;
                }
            }
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)
axiosInstance.interceptors.response.use(
    function(response){
        //stop global loader here
        return processResponse(response);
    },
    function(error){
        //Stop global loader here
        return Promise.reject(processError(error));
    }
)

////////////////////////
// If success=> return {isSucess:true,data:Object}
//If fail -> return {isFailure:true,status:string,msg:string,code:int}
////////////////////////
const processResponse=(response)=>{
    if(response?.status === 200){
        return {
            isSuccess:true,
            data:response.data
        }
    }else{
        return{
            isFailure:true,
            status:response?.status,
            msg:response?.msg,
            code:response?.code
        }
    }
}
const processError=(error) =>{
        if (error.response){
            //Request made and server responded with a status other
            //falls out of the range 2.x.x
           console.log('ERROR IN RESPONSE:',error.toJSON());
            return{
                isError:true,
                msg:API_NOTIFICATION_MESSAGES.responseFailure,
                code:error.response.status
            }
        }else if(error.request){
            //Request made but no repsonse was received
            console.log('ERROR IN REQUEST:',error.toJSON());
            return{
                isError:true,
                msg:API_NOTIFICATION_MESSAGES.requestFailure,
                code:""
            }
            
        }else{
            //Something happend in setting up request that triggers an error
            console.log('ERROR IN NETWORK:',error.toJSON());
            return{
                isError:true,
                msg:API_NOTIFICATION_MESSAGES.networkError,
                code:""
            }

        }   
}

const API={};

for(const [key,value] of Object.entries(SERVICE_URLS)){
    API[key]=(body,showUploadProgress,showDownloadProgress)=>
        axiosInstance({
            method:value.method,
            url:value.url,
            data:value.method === 'DELETE' ? {} : body,
            responseType:value.responseType,
            headers:{
                authorization:getAccessToken()
            },
            TYPE:getType(value,body),
            onUploadProgress:function(progressEvent){
                if(showUploadProgress){
                    let percentCompleted=Math.round((progressEvent.loaded * 100 ) / progressEvent.total);
                    showUploadProgress(percentCompleted);
                }
            },
            onDownloadProgress:function(progressEvent){
                if(showDownloadProgress){
                    let percentCompleted=Math.round((progressEvent.loaded * 100 ) / progressEvent.total)
                    showDownloadProgress(percentCompleted);
                }
            }

        });

}

API.uploadFile = (body) =>
    axiosInstance.post('/file/upload', body, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });


export { API } ;
