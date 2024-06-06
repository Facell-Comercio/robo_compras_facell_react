import { DataTable } from "@/components/custom/DataTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { useState } from "react"

type FilialCaptura = {
    nome: string,
    pedidos: number,
    faturados: number,
    notas_fiscais: number,
    status: 'PENDENTE' | 'ERRO' | 'OK',
    obs?: string
}
export const TableCapturaGN = () => {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const data = useStoreCapturaGN().state.filiais;

    const columns: ColumnDef<FilialCaptura>[] = [
        {
            accessorKey: "nome",
            header: 'FILIAL',
        },
        {
            accessorKey: 'pedidos'
        },
        {
            accessorKey: 'faturados'
        },
        {
            accessorKey: 'notas_fiscais',
            header: 'POSIÇÃO FINANCEIRA'
        },
        {
            accessorKey: 'status'
        },
        {
            accessorKey: 'obs'
        },
    ]

    return (
        <DataTable
            columns={columns}
            // @ts-ignore
            data={data || []}
            // @ts-ignore
            rowCount={data.length || 0}
            pagination={pagination}
            setPagination={setPagination}
        />
    )
}