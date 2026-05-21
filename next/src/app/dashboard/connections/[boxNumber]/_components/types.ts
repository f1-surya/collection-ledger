import type { BasePack } from "@/app/dashboard/base-packs/_components/types";

export interface Payment {
  id: string;
  isMigration: boolean;
  date: Date;
  customerPrice: number;
  lcoPrice: number;
  items: {
    id: string;
    name: string;
    lcoPrice: number;
    customerPrice: number;
  }[];
  currentPack: BasePack;
  to: BasePack | null;
  connection: { name: string };
}
