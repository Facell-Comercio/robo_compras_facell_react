export type Filial = {
    id?: string,
    active: boolean,
    nome: string,
    id_grupo_economico: string,
    grupo_economico?: string,
    id_matriz?: string,
    
    nome_fantasia?: string,
    razao?: string,
    telefone?: string,
    email?: string,

    cnpj: string,
    apelido?: string,
    cod_datasys?:string,
    cnpj_datasys?: string,
    
    logradouro?:string,
    numero?: string,
    complemento?: string,
    cep?:string,
    municipio?:string,
    uf?:string,
}