import { getNotasFiscais } from "@/api/notas-fiscais"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { exportToExcel } from "@/helper/importExportXLS"
import { useQueryClient } from "@tanstack/react-query"
import { Check, DollarSign, Download, EraserIcon, Filter } from "lucide-react"

export const Header = () => {
  const filters = useStoreCapturaGN().notasFiscais.filters;
  const setFilters = useStoreCapturaGN(state => state.setFiltersNotasFiscais)
  const clearFilters = useStoreCapturaGN(state => state.clearFiltersNotasFiscais)

  const queryClient = useQueryClient()

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

  const handleDatasysClick = async ()=>{

  }

  const handleFinanceiroClick = async ()=>{

  }

  return (
    <div className="flex gap-3 items-center overflow-auto scroll-thin pb-2">
      <Button onClick={handleDatasysClick} size={'sm'} variant={'default'} className="flex gap-2 items-center"><Check size={18} /> Checar Datasys</Button>
      <Button onClick={handleFinanceiroClick} size={'sm'} variant={'tertiary'} className="flex gap-2 items-center"><DollarSign size={18} /> Lançar Financeiro</Button>

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

      <Select value={filters.id_grupo_economico || 'all'} onValueChange={(val: string) => { setFilters({ id_grupo_economico: val }) }}>
        <SelectTrigger>
          <SelectValue placeholder="GRUPO ECONÔMICO" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">TODOS</SelectItem>
          <SelectItem value="1">FACELL</SelectItem>
          <SelectItem value="9">FORTTELECOM</SelectItem>
        </SelectContent>
      </Select>


    </div>
  )
}