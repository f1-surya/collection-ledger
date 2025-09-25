"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Area } from "../../areas/_components/areas";
import type { BasePack } from "../../base-packs/_components/types";

export type Connection = {
  id: number;
  name: string;
  boxNumber: string;
  phoneNumber?: string;
  area: Area;
  basePack: BasePack;
  lastPayment?: string;
};

export const columns: ColumnDef<Connection>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
  },
  {
    accessorKey: "boxNumber",
    header: () => <div className="font-semibold">Smartcard</div>,
  },
  {
    id: "area",
    accessorFn: (connection) => connection.area.name,
    header: () => <div className="font-semibold">Area</div>,
  },
  {
    accessorFn: (connection) => connection.basePack.name,
    header: "Pack",
  },
  {
    id: "customerPrice",
    header: () => <div className="font-semibold">MRP ₹</div>,
    accessorFn: (con) => con.basePack.customerPrice,
  },
  {
    accessorKey: "lastPayment",
    header: () => <div className="font-semibold">Last payment</div>,
    cell: ({ row }) => {
      const lastPayment = row.getValue("lastPayment");
      if (!lastPayment) return "Nil";

      return format(lastPayment as string, "dd MMM yyyy");
    },
  },
];
