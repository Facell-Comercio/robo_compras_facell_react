import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSpinner } from "react-icons/fa6";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  pagination?: PaginationState;
  setPagination?: (pagination: PaginationState) => void;
  rowSelection?: RowSelectionState;
  handleRowSelection?: (data: any) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  pagination,
  setPagination,
  columns,
  data,
  rowCount,
  rowSelection,
  handleRowSelection,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    rowCount: rowCount || 0,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: pagination || {pageIndex: 0, pageSize: 1},
      rowSelection: rowSelection || {},
    },
    onPaginationChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(pagination);
      if (setPagination) {
        setPagination(result);
      }
      if (handleRowSelection) {
        handleRowSelection({ rowSelection: {}, idSelection: [] });
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(rowSelection);
      if (handleRowSelection) {
        // @ts-expect-error ignorado
        const ids = Object.keys(result).map((c) => data[c].id);
        handleRowSelection({ rowSelection: result, idSelection: ids });
      }
    },
    manualPagination: !!pagination ,
  });

  //^ Foi adicionada a class scroll-thin no componente de Table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    onClick={() => header.column.toggleSorting()}
                    className="text-nowrap cursor-pointer text-xs"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Se for do tipo id não reenderiza os ícones */}
                        {header.column.getCanSort() &&
                          header.column.getIsSorted() === "asc" &&
                          " 🔼"}
                        {header.column.getCanSort() &&
                          header.column.getIsSorted() === "desc" &&
                          " 🔽"}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="scroll-thin">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-xs text-nowrap p-[5px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {isLoading ? (
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="flex gap-2 w-full items-center justify-center">
                    <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                    Carregando...
                  </span>
                </TableCell>
              ) : (
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                ></TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between py-2 px-3">
        <div
          className={`flex-1 text-sm text-muted-foreground ${
            !handleRowSelection && "hidden"
          }`}
        >
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div
          className={`flex flex-col sm:flex-row gap-3 items-center ${
            !handleRowSelection && "w-full justify-between"
          } space-x-6 lg:space-x-8`}
        >
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Linhas por página</p>
            <Select
              value={`${
                table.getState().pagination?.pageSize?.toString() || ""
              }`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination?.pageSize || 0}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 30, 40, 50, 100, 200, 300].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex text-nowrap w-[100px] items-center justify-center text-sm font-medium">
            Página {(table.getState().pagination?.pageIndex || 0) + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Vá para a primeira</span>
              <ChevronsLeft size={18}/>
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Próxima</span>
              <ChevronRight size={18} />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Vá para a última página</span>
              <ChevronsRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
