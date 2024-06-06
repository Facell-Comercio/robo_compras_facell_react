export type Filial = {
    id: number,
    nome: string,
    tim_cod_sap: number,
    id_grupo_economico: number,
}

export type CapturaGNFilial = Filial & {
    pedidos: number,
    faturados: number,
    notas_fiscais: number,
    status: 'PENDENTE' | 'ERRO' | 'OK',
    obs: string,
    
}