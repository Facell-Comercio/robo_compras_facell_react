import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export interface User {
    ativo: boolean
    departamentos: DepartamentoUser[]
    email: string
    filiais: FilialUser[]
    id: string
    img_url?: string
    nome: string
    permissoes: PermissaoUser[]
  }
  
export interface DepartamentoUser {
    id: number
    nome: string
    gestor: number
}

export interface FilialUser {
    id: number
    nome: string
    gestor: number
}

export interface PermissaoUser {
    id: number
    nome: string
}

interface IAuthStore {
    user: User | null,
    token: string | null,
    isAuthenticate: boolean
    login: ({ user, token }: ILogin) => void,
    logout: () => void,
}

interface ILogin {
    user: User,
    token: string
}

export const useAuthStore = create(
    persist<IAuthStore>((set) => ({
        user: null,
        token: null,
        isAuthenticate: false,
        
        login: async ({ user, token }: ILogin) => {
            set({ user, token, isAuthenticate: true })
        },
        logout: () => {
            set({ user: null, token: null, isAuthenticate: false })
        }
    }),
        {
            name: 'auth-storage',
        }
    )
)