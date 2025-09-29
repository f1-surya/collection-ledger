import type { BasePack } from "@/app/dashboard/base-packs/_components/types";
import type { Connection } from "../../_components/columns";

export interface Payment {
  id: number;
  isMigration: boolean;
  date: string;
  customerPrice: number;
  lcoPrice: number;
  currentPack: BasePack;
  to?: BasePack;
  connection: Connection;
}
