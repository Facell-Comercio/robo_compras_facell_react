import { getNotasFiscais, pushCheckDatasys, pushCheckFinanceiro } from "@/api/notas-fiscais"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { exportToExcel } from "@/helper/importExportXLS"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, DollarSign, Download, EraserIcon, Filter } from "lucide-react"
import { useState } from "react"
import { FaSpinner } from "react-icons/fa6"

export const Header = () => {
  const queryClient = useQueryClient()

  const filters = useStoreCapturaGN(state => state.notasFiscais.filters);
  const setFilters = useStoreCapturaGN(state => state.setFiltersNotasFiscais)
  const clearFilters = useStoreCapturaGN(state => state.clearFiltersNotasFiscais)

  const [fetching, setFetching] = useState({
    datasys: false,
    financeiro: false
  })



  const handleFilter = () => {
    queryClient.invalidateQueries({
      queryKey: ['notas_fiscais']
    })
  }
  const handleClearFilter = async () => {
    await new Promise((resolve) => {
      clearFilters()
      resolve(1)
    })
    queryClient.invalidateQueries({
      queryKey: ['notas_fiscais']
    })
  }

  const handleClickExport = async () => {
    try {
      const result = await getNotasFiscais({ filters })
      const data = result?.data?.rows || []
      exportToExcel(data, 'NOTAS FISCAIS')
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Erro ao tentar exportar',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message || 'Erro desconhecido!'
      })
    }
  }

  const handleDatasysClick = async () => {
    try {
      setFetching(prev=>({...prev, 
        datasys: true,
      }))
      await pushCheckDatasys({})
      queryClient.invalidateQueries({queryKey: ['notas_fiscais']})
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Erro na operação',
        // @ts-ignore 
        description: error?.response?.data?.message || 'Erro na conexão, tente novamente mais tarde.'
      })
    } finally{
      setFetching(prev=>({...prev, datasys: false}))
    }
  }

  const handleFinanceiroClick = async () => {
    try {
      setFetching(prev=>({...prev, 
        financeiro: true,
      }))
      await pushCheckFinanceiro({})
      queryClient.invalidateQueries({queryKey: ['notas_fiscais']})
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Erro na operação',
        // @ts-ignore 
        description: error?.response?.data?.message || 'Erro na conexão, tente novamente mais tarde.'
      })
    } finally{
      setFetching(prev=>({...prev, financeiro: false}))
    }
  }

  return (
    <div className="flex gap-3 items-center overflow-auto scroll-thin pb-2">
      <Button disabled={fetching.datasys} onClick={handleDatasysClick} size={'sm'} variant={'default'} className="flex gap-2 items-center">{fetching.datasys ? <FaSpinner className="animate-spin" size={18}/> : <Check size={18} />} Checar Datasys</Button>
      <Button disabled={fetching.financeiro} onClick={handleFinanceiroClick} size={'sm'} variant={'tertiary'} className="flex gap-2 items-center">{fetching.financeiro ? <FaSpinner className="animate-spin" size={18}/> : <DollarSign size={18} />} Lançar Financeiro</Button>

      <Button onClick={handleClickExport} size={'sm'} variant={'success'} className="flex gap-2 items-center"><Download size={18} /> Exportar</Button>
      <Button onClick={handleFilter} size={'sm'} className="flex gap-2 items-center"><Filter size={18} /> Filtrar</Button>
      <Button onClick={handleClearFilter} size={'sm'} variant={'secondary'} className="flex gap-2 items-center"><EraserIcon size={18} /> Resetar</Button>

      <DatePickerWithRange
        date={filters.range_data}
        setDate={(date) => {
          console.log(date)
          setFilters({ range_data: date });
        }}
      />

      <Select value={filters.status || 'all'} onValueChange={(val: string) => { setFilters({ status: val }) }}>
        <SelectTrigger>
          <SelectValue placeholder="STATUS" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">TODOS STATUS</SelectItem>
          <SelectItem value="PENDENTE DATASYS">PENDENTE DATASYS</SelectItem>
          <SelectItem value="PENDENTE FINANCEIRO">PENDENTE FINANCEIRO</SelectItem>
          <SelectItem value="OK">OK</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.id_grupo_economico || 'all'} onValueChange={(val: string) => { setFilters({ id_grupo_economico: val }) }}>
        <SelectTrigger>
          <SelectValue placeholder="GRUPO ECONÔMICO" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">TODOS GRUPOS</SelectItem>
          <SelectItem value="1">FACELL</SelectItem>
          <SelectItem value="9">FORTTELECOM</SelectItem>
        </SelectContent>
      </Select>


    </div>
  )
}