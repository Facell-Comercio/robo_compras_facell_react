import { api } from "@/helper/api";

export const getNotasFiscais = async (params:any)=>{
    return api.get('/tim/gn/notas-fiscais/', {params})
}