import type { BasePack } from "@/app/dashboard/base-packs/_components/types";

export interface Payment {
  id: number;
  isMigration: boolean;
  date: string;
  customerPrice: number;
  lcoPrice: number;
  currentPack: BasePack;
  to?: BasePack;
}
