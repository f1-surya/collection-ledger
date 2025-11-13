"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TvMinimal } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import MyPagination from "@/components/my-pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Connection, columns } from "./columns";
import CreateConnection from "./create";

const ConnectionDetails = dynamic(() => import("./connection-details"));

interface DataTableProps {
  data: Connection[];
  pages: number;
}

export default function ConnectionTable({ data, pages }: DataTableProps) {
  const [connections, setConnections] = useState(data);
  const [currConnection, setCurrConnection] = useState<
    Connection | undefined
  >();
  const table = useReactTable({
    data: connections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 250);
  const t = useTranslations("Connections");

  useEffect(() => {
    setConnections(data);
  }, [data]);

  const markAsPaid = (connectionId: string) => {
    setConnections((prevCons) =>
      prevCons.map((con) =>
        con.id === connectionId ? { ...con, lastPayment: new Date() } : con,
      ),
    );
    setCurrConnection(undefined);
  };

  return (
    <div>
      <div className="flex items-center gap-4 w-full py-4">
        <Input
          placeholder="Search by name or SMC"
          type="search"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
      </div>
      {!table.getRowModel().rows.length ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <TvMinimal />
            </EmptyMedia>
            <EmptyTitle>{t("noConnectionsForQuery")}</EmptyTitle>
          </EmptyHeader>
          <CreateConnection />
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-md border mb-4">
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <MyPagination pages={pages} />
      <ConnectionDetails
        connection={currConnection}
        onOpenChange={setCurrConnection}
        callback={markAsPaid}
      />
    </div>
  );
}
