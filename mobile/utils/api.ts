import axios,{AxiosInstance} from "axios"
import { useAuth } from "@clerk/clerk-expo"

const API_BASE_URL = "https://x-clone-silk-mu.vercel.app/api"

export const createApiClient = (getToken:()=> Promise<string|null>):AxiosInstance=>{
  const api = axios.create({baseURL:API_BASE_URL})

api.interceptors.request.use(async (config) => {
  const token = await getToken()
  console.log("Token being Sent:",token);
  

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

  return api
}


export const useApiClient = ():AxiosInstance =>{
    const {getToken} = useAuth()
    return createApiClient(getToken)
}

export const userApi = {
    syncUser: (api:AxiosInstance) => api.post("users/sync"),
    getCurrentUser:(api:AxiosInstance) => api.get('/users/me'),
    updateProfile:(api:AxiosInstance,data:any) => api.put('users/profile',data)
}