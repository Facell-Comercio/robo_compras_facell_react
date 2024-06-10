import { api } from "@/helper/api";

export const getPedidosFaturados = async (params:any)=>{
    return api.get('/tim/gn/faturados/', {params})
}

export const importFaturados = async (params:any)=>{
    return api.post('/tim/gn/faturados/', {
        ...params
    })
}