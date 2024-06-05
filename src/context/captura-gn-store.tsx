import { FeedbackItemProps } from '@/pages/captura-GN/components/FeedbackItem';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type StateOptions = 'initial' | 'running';

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

interface CapturaGNProps {
    state: StateOptions,
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
    

    setState: (state:StateOptions) => void,
    pushFeedback: (fd:FeedbackItemProps)=>void,
    clearFeedback: ()=>void

    setFiltersNotasFiscais: (filters:FiltersNotasFiscais)=>void
    clearFiltersNotasFiscais: ()=>void

    setFiltersPedidos: (filters:FiltersPedidos)=>void
    clearFiltersPedidos: ()=>void

    setFiltersFaturados: (filters:FiltersFaturados)=>void
    clearFiltersFaturados: ()=>void
}

const initialFeedback = undefined;
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
const initialFiltersNotasFiscais = {
    range_data: {
        from: subDays(new Date(), 30),
        to: new Date()
    }
}

export const useStoreCapturaGN = create<CapturaGNProps>((set) => ({
        state: 'initial',
        feedback: initialFeedback || [],
        notasFiscais: {
            filters: initialFiltersNotasFiscais
        },
        pedidos: {
            filters: initialFiltersPedidos
        },
        faturados: {
            filters: initialFiltersFaturados
        },
        
        
        setState: (state) => {
            set({ state: state })
        },
        pushFeedback: (fd:FeedbackItemProps)=>set((state)=>({ feedback: [...state.feedback, fd]})),
        clearFeedback: ()=>set({ feedback: [] }),

        setFiltersNotasFiscais: (filters)=>{set(state=>({ notasFiscais: {...state.notasFiscais, filters: {...state.notasFiscais.filters, ...filters}} }))},
        clearFiltersNotasFiscais: ()=>set((state)=>({ notasFiscais: {...state.notasFiscais, filters: {...initialFiltersNotasFiscais}} })),

        setFiltersPedidos: (filters)=>{set(state=>({ pedidos: {...state.pedidos, filters: {...state.pedidos.filters, ...filters}} }))},
        clearFiltersPedidos: ()=>set((state)=>({ pedidos: {...state.pedidos, filters: {...initialFiltersPedidos}} })),

        setFiltersFaturados: (filters)=>{set(state=>({ faturados: {...state.faturados, filters: {...state.faturados.filters, ...filters}} }))},
        clearFiltersFaturados: ()=>set((state)=>({ faturados: {...state.faturados, filters: {...initialFiltersFaturados}} }))
    }))