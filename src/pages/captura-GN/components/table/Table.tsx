import { CapturaGNFilial } from "@/@types/filial"
import { DataTable } from "@/components/custom/DataTable"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { useState } from "react"

export const TableCapturaGN = () => {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const data = useStoreCapturaGN().state.filiais;

    const columns: ColumnDef<CapturaGNFilial>[] = [
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