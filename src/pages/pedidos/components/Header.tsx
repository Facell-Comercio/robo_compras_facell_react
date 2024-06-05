import { getPedidos } from "@/api/pedidos"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { exportToExcel } from "@/helper/importExportXLS"
import { useQueryClient } from "@tanstack/react-query"
import { Download, EraserIcon, Filter } from "lucide-react"

export const Header = () => {
  const filters = useStoreCapturaGN().pedidos.filters;
  const setFilters = useStoreCapturaGN(state => state.setFiltersPedidos)
  const clearFilters = useStoreCapturaGN(state => state.clearFiltersPedidos)

  const queryClient = useQueryClient()

  const handleFilter = () => {
    queryClient.invalidateQueries({
      queryKey: ['pedidos']
    })
  }
  const handleClearFilter = async () => {
    await new Promise((resolve)=>{
      clearFilters()
      resolve(1)
    })
    queryClient.invalidateQueries({
      queryKey: ['pedidos']
    })
  }

  const handleClickExport = async ()=>{
    try {
      const result = await getPedidos({filters})
      const data = result?.data?.rows || []
      exportToExcel(data, 'PEDIDOS TIM')
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Erro ao tentar exportar', 
        // @ts-ignore
        description: error?.response?.data?.message || error?.message || 'Erro desconhecido!'
      })
    }
  }
  
  return (
    <div className="flex gap-3 items-center overflow-auto scroll-thin pb-2">
    <Button onClick={handleClickExport} size={'sm'} variant={'success'} className="flex gap-2 items-center"><Download size={18} /> Exportar</Button>
    <Button onClick={handleFilter} size={'sm'} className="flex gap-2 items-center"><Filter size={18} /> Filtrar</Button>
    <Button onClick={handleClearFilter} size={'sm'} variant={'secondary'}  className="flex gap-2 items-center"><EraserIcon size={18} /> Resetar</Button>

      <DatePickerWithRange
        date={filters.range_data}
        setDate={(date) => {
          setFilters({ range_data: date });
        }}
      />

      <Input className="min-w-[15ch]" placeholder="Cód. Material" value={filters.codMaterial || ''} onChange={(e)=>setFilters({ codMaterial: e.target.value})}/>
      <Input className="min-w-[15ch]" placeholder="Descrição" value={filters.descricao || ''} onChange={(e)=>setFilters({ descricao: e.target.value})}/>

      <Select value={filters.id_grupo_economico || 'all'} onValueChange={(val: string) => { setFilters({ id_grupo_economico: val }) }}>
        <SelectTrigger>
          <SelectValue placeholder="GRUPO ECONÔMICO"/>
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