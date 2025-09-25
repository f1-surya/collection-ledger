"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Connection } from "./columns";
import { ConnectionDetails } from "./connection-details";
import CreateConnection from "./create";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ConnectionTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [connections, setConnections] = useState(data);
  const [currConnection, setCurrConnection] = useState<
    Connection | undefined
  >();
  const [newConnection, setNewConnection] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data: connections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
  });

  const markAsPaid = (connectionId: number) => {
    setConnections((prevCons) =>
      prevCons.map((con) =>
        // @ts-expect-error
        con.id === connectionId
          ? { ...con, lastPayment: new Date().toISOString() }
          : con,
      ),
    );
    setCurrConnection(undefined);
  };

  return (
    <div>
      <div className="flex items-center gap-4 w-full py-4">
        <Input
          placeholder="Filter by name"
          type="search"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
        <Button
          className="w-18"
          onClick={() => setNewConnection(!newConnection)}
        >
          <Plus />
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setCurrConnection(row.original as Connection)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <CreateConnection open={newConnection} onOpenChange={setNewConnection} />
      <ConnectionDetails
        connection={currConnection}
        onOpenChange={setCurrConnection}
        callback={markAsPaid}
      />
    </div>
  );
}
