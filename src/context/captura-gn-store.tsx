import { CapturaGNFilial, Filial } from '@/@types/filial';
import { FeedbackItemProps } from '@/pages/captura-GN/components/FeedbackItem';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';


  type StatusOptions = 'initial' | 'running';

  type StateCapturaGN = {
    status: StatusOptions
    filiais: CapturaGNFilial[],
    id_grupo_economico?: string,
    exibir_janela?: boolean,
    data_inicial?: Date,
    data_final?: Date,
    token?: string,
    rsa?: string
  }



type FiltersNotasFiscais = {
    range_data?: DateRange,
    status?:string,
    descricao?: string,
    id_grupo_economico?: string,
}
type FiltersPedidos = {
    range_data?: DateRange,
    codMaterial?:string,
    descricao?: string,
    id_grupo_economico?: string,
}
type FiltersFaturados = {
    range_data?: DateRange,
    codMaterial?:string,
    descricao?: string,
    id_grupo_economico?: string,
}

type UpdateGnFilial =  Filial & Partial<CapturaGNFilial>

interface CapturaGNProps {
    state: StateCapturaGN,
    feedback:FeedbackItemProps[],
    notasFiscais: {
        filters: FiltersNotasFiscais,
    },
    pedidos: {
        filters: FiltersPedidos,
    },
    faturados: {
        filters: FiltersFaturados,
    }
    

    setState: (state:Partial<StateCapturaGN>) => void,

    pushFeedback: (fd:FeedbackItemProps)=>void,
    clearFeedback: ()=>void

    setFiltersNotasFiscais: (filters:FiltersNotasFiscais)=>void
    clearFiltersNotasFiscais: ()=>void

    setFiltersPedidos: (filters:FiltersPedidos)=>void
    clearFiltersPedidos: ()=>void

    setFiltersFaturados: (filters:FiltersFaturados)=>void
    clearFiltersFaturados: ()=>void

    updateGnFilial: (data:UpdateGnFilial)=>void
}

const initialFeedback: FeedbackItemProps[] = [];

const initialFiltersNotasFiscais = {
    range_data: {
        from: subDays(new Date(), 30),
        to: new Date()
    }
}

const initialFiltersPedidos = {
    range_data: {
        from: subDays(new Date(), 30),
        to: new Date()
    }
}
const initialFiltersFaturados = {
    range_data: {
        from: subDays(new Date(), 30),
        to: new Date()
    }
}

export const useStoreCapturaGN = create<CapturaGNProps>((set) => ({
        state: {
            status: 'initial',
            filiais: [],
        },
        feedback: initialFeedback,
        notasFiscais: {
            filters: {...initialFiltersNotasFiscais},
        },
        pedidos: {
            filters: {...initialFiltersPedidos},
        },
        faturados: {
            filters: {...initialFiltersFaturados},
        },
        
        
        setState: (newState) => {
            set((prev)=>({ state: {...prev.state, ...newState} }))
        },
        pushFeedback: (newFeedback:FeedbackItemProps)=>set((state)=>{
            let feedbacks = state.feedback
            feedbacks.unshift(newFeedback)
            return ({ feedback: [...feedbacks]})
        }),
        clearFeedback: ()=>set({ feedback: [] }),

        setFiltersNotasFiscais: (newFilters)=>set(state=>({ notasFiscais: {...state.notasFiscais, filters: {...state.notasFiscais.filters, ...newFilters}} })),
        clearFiltersNotasFiscais: ()=>set((state)=>({ notasFiscais: {...state.notasFiscais, filters: {...initialFiltersNotasFiscais}} })),

        setFiltersPedidos: (newFilters)=>set(state=>({ pedidos: {...state.pedidos, filters: {...state.pedidos.filters, ...newFilters}} })),
        clearFiltersPedidos: ()=>set((state)=>({ pedidos: {...state.pedidos, filters: {...initialFiltersPedidos}} })),

        setFiltersFaturados: (newFilters)=>set(state=>({ faturados: {...state.faturados, filters: {...state.faturados.filters, ...newFilters}} })),
        clearFiltersFaturados: ()=>set((state)=>({ faturados: {...state.faturados, filters: {...initialFiltersFaturados}} })),

        updateGnFilial(data) {
            set(prev=>({
                state: {...prev.state, filiais: prev.state.filiais.map((filial) =>
                    filial.id == data.id ? { ...filial, ...data } : filial
                  )}, 
            }))
        },
    
    
    }))