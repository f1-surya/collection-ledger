"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { isThisMonth } from "date-fns";
import { TvMinimal } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
import { BulkPay, useConnectionsSelection } from "./connections-selections";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { selected, setSelected, clear } = useConnectionsSelection();
  const table = useReactTable({
    data: connections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.boxNumber,
    enableRowSelection: (row) => {
      const lastPayment = row.original.lastPayment;
      if (!lastPayment) {
        return true;
      }
      return !isThisMonth(lastPayment);
    },
    onRowSelectionChange: setSelected,
    state: {
      rowSelection: selected,
    },
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      <div className="flex flex-col justify-center gap-4 w-full py-4">
        <Input
          placeholder="Search by name or SMC"
          type="search"
          ref={inputRef}
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
        <BulkPay smcs={Object.keys(selected)} clear={clear} />
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.id.includes("select")
                          ? undefined
                          : () => setCurrConnection(row.original)
                      }
                    >
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
