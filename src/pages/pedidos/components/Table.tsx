import { getPedidos } from "@/api/pedidos"
import { DataTable } from "@/components/custom/DataTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { useState } from "react"

type Pedido = {
  id: number,
  dataPedido: Date,
  codSapTim: number,
  pedido: string,
  codMaterial: string,
  descricao: string,
  qtdeSolicitada: number,
  qtdeAtendida: number,
  status: string,
  grupo_economico: string,
  filial: string,
}
export const Table = () => {
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10})
  const filters = useStoreCapturaGN().pedidos.filters;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pedidos', pagination], 
    queryFn: ()=>getPedidos({filters, pagination}),
    placeholderData: keepPreviousData
  })

  const columns: ColumnDef<Pedido>[] = [
    {
      accessorKey: "dataPedido",
      header: 'DATA PEDIDO',
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
      accessorKey: 'codMaterial',
      header: 'CÓD. MATERIAL'
    },
    {
      accessorKey: 'descricao'
    },
    {
      accessorKey: 'qtdeSolicitada',
      header: 'SOLICITADO'
    },
    {
      accessorKey: 'qtdeAtendida',
      header: 'ATENDIDO'
    },
    {
      accessorKey: 'status'
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