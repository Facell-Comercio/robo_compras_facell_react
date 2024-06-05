import { api } from "@/helper/api";

export const getPedidos = async (params:any)=>{
    return api.get('/tim/gn/pedidos/', {params})
}