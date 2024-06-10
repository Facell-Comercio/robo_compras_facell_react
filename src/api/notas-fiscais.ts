import { api } from "@/helper/api";

export const getNotasFiscais = async (params:any)=>{
    return api.get('/tim/gn/notas-fiscais/', {params})
}

export const pushCheckDatasys = async (params:any)=>{
    return api.post('/tim/gn/notas-fiscais/check-datasys', {
        ...params
    })
}
export const pushCheckFinanceiro = async (params:any)=>{
    return api.post('/tim/gn/notas-fiscais/check-financeiro', {
        ...params
    })
}

export const importNotasFiscais = async (params:any)=>{
    return api.post('/tim/gn/notas-fiscais/', {
        ...params
    })
}