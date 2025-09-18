"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Connection = {
  id: number;
  name: string;
  boxNumber: string;
  phoneNumber?: string;
  area: {
    id: number;
    name: string;
  };
  basePack: {
    id: number;
    name: string;
    lcoPrice: number;
    customerPrice: number;
  };
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

      return new Date(lastPayment as string).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
];
