import type { BasePack } from "@/app/dashboard/base-packs/_components/types";

export interface Payment {
  id: number;
  name: string;
  isMigration: boolean;
  date: string;
  customerPrice: number;
  lcoPrice: number;
  currentPack: BasePack;
  to?: BasePack;
}
