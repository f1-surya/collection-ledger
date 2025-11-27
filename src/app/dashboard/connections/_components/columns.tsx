"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

export type Connection = {
  id: string;
  name: string;
  boxNumber: string;
  phoneNumber: string | null;
  area: { id: string; name: string };
  basePack: {
    id: string;
    name: string;
    lcoPrice: number;
    customerPrice: number;
  };
  lastPayment: Date | null;
};

export const columns: ColumnDef<Connection>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={row.getToggleSelectedHandler()}
        className="size-5"
      />
    ),
  },
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

      return format(lastPayment as Date, "dd MMM yyyy");
    },
  },
];
