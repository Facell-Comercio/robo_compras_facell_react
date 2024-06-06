import { api } from "@/helper/api"

export const getFiliais = async (params:any)=>{
    return api.get('/filial/', {params})
}