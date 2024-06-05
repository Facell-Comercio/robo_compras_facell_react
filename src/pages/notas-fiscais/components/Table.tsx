import { getNotasFiscais } from "@/api/notas-fiscais"
import { DataTable } from "@/components/custom/DataTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { useState } from "react"

type NotaFiscal = {
  id: number,
  created_at: Date,
  updated_at: Date,
  
  tim_cod_sap: number,
  nota_fiscal: string,
  data_emissao: Date,
  data_vencimento: Date,
  status: 'PENDENTE DATASYS' | 'PENDENTE FINANCEIRO' | 'OK',
  obs: string | null,
  
  filial: string,
  grupo_economico: string,
  
  cnpj_fornecedor: string | null,
  chave_nf: string | null,
  data_recebimento: Date | null,

  id_titulo: number | null,
  data_financeiro: Date | null,
}

export const Table = () => {
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10})
  const filters = useStoreCapturaGN().pedidos.filters;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notas_fiscais', pagination], 
    queryFn: ()=>getNotasFiscais({filters, pagination}),
    placeholderData: keepPreviousData
  })

  const columns: ColumnDef<NotaFiscal>[] = [
    {
      accessorKey: "data_emissao",
      header: 'EMISSÃO',
      cell: (info) => (
        <span>{formatDate(new Date(info.getValue<Date>()), 'dd/MM/yyyy')}</span>
      )
    },
    {
      accessorKey: "data_vencimento",
      header: 'VENCIMENTO',
      cell: (info) => (
        <span>{formatDate(new Date(info.getValue<Date>()), 'dd/MM/yyyy')}</span>
      )
    },
    {
      accessorKey: 'grupo_economico'
    },
    {
      accessorKey: 'filial'
    },
    {
      accessorKey: 'nota_fiscal'
    },
    {
      accessorKey: 'status'
    },
    {
      accessorKey: 'obs'
    },
    {
      accessorKey: 'id_titulo'
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