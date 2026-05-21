import { Checkbox } from "$lib/components/ui/checkbox";
import PaymentStatusCell from "./PaymentStatusCell.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";

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
  addonPrices: number;
  addonLcoPrices: number;
};

export const columns: ColumnDef<Connection>[] = [
  {
    id: "select",
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        checked: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        onCheckedChange: row.getToggleSelectedHandler(),
        class: "size-5",
      }),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "boxNumber",
    header: "SMC",
  },
  {
    id: "area",
    header: "Area",
    accessorFn: (connection) => connection.area.name,
  },
  {
    id: "pack",
    accessorFn: (connection) => connection.basePack.name,
    header: "Pack",
  },
  {
    id: "customerPrice",
    header: "MRP ₹",
    accessorFn: (con) => con.basePack.customerPrice + con.addonPrices,
  },
  {
    accessorKey: "lastPayment",
    header: "Last payment",
    cell: ({ row }) =>
      renderComponent(PaymentStatusCell, {
        lastPayment: row.getValue("lastPayment"),
      }),
  },
];
