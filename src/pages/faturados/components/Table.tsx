import { getPedidosFaturados } from "@/api/pedidos-faturados"
import { DataTable } from "@/components/custom/DataTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { normalizeCurrency } from "@/helper/mask"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { useState } from "react"

type Faturado = {
  id: number,
  data_criacao: Date,
  tim_cod_sap: number,
  pedido: string,
  cod_material: string,
  descricao: string,
  qtde: number,
  valor_unitario: number,
  valor_total: number,
  grupo_economico: string,
  id_grupo_economico: number,
  filial: string,
  id_filial: number,
}
export const Table = () => {
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10})
  const filters = useStoreCapturaGN().faturados.filters;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['faturados', pagination], 
    queryFn: ()=>getPedidosFaturados({filters, pagination}),
    placeholderData: keepPreviousData
  })

  const columns: ColumnDef<Faturado>[] = [
    {
      accessorKey: "data_criacao",
      header: 'DATA CRIAÇÃO',
      cell: (info) => (
        <span>{formatDate(info.getValue<Date>(), 'dd/MM/yyyy')}</span>
      )
    },
    {
      accessorKey: 'grupo_economico'
    },
    {
      accessorKey: 'filial'
    },
    {
      accessorKey: 'pedido'
    },
    {
      accessorKey: 'cod_material',
      header: 'CÓD. MATERIAL'
    },
    {
      accessorKey: 'descricao'
    },
    {
      accessorKey: 'qtde',
      header: 'QTDE'
    },
    {
      accessorKey: 'valor_unitario',
      header: 'VALOR UND',
      cell: (info)=>{
        let val = info.getValue<number>()
        return <span>{normalizeCurrency(val)}</span>
      }
    },
    {
      accessorKey: 'valor_total',
      header: 'VALOR TOTAL',
      cell: (info)=>{
        let val = info.getValue<number>()
        return <span>{normalizeCurrency(val)}</span>
      }
    },


  ]

  if(isError){
    return <Alert variant={'destructive'}>
      <AlertTitle>Erro ao tentar buscar os pedidos</AlertTitle>
      <AlertDescription>Tente filtrar novamente os dados...</AlertDescription>
    </Alert>
  }

  return (
    <div className="max-h-[70vh] overflow-auto scroll-thin">
      {isLoading ? (
        <span>Carregando...</span>
      ) : (
        <DataTable
 
          columns={columns} 
          // @ts-ignore
          data={data?.data?.rows || []} 
          // @ts-ignore
          rowCount={data?.data?.rowCount || 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  )
}