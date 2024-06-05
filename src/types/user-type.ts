
export type UserPermissao = {
    id: string,
    id_permissao: string,
    nome: string,
    id_user: string,
}

export type UserDepartamento = {
    id: string,
    id_departamento: string,
    nome: string,
    id_user: string,
    gestor: boolean,
}

export type UserFilial = {
    id: string,
    id_filial: string,
    nome: string,
    id_user: string,
    gestor: boolean,
}

export type UserCentroCusto = {
    id: string,
    id_centro_custo: string,
    nome: string,
    id_user: string,
    gestor: boolean,
}


export type User = {
    id: string
    nome: string
    active: boolean
    email: string
    senha?: string
    img_url: string
    departamentos: UserDepartamento[]
    permissoes: UserPermissao[]
    filiais: UserFilial[]
    centros_custo: UserCentroCusto[]
}