"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BasePack } from "../../../base-packs/_components/types";
import type { Connection } from "../../_components/columns";

interface MigrationDialogProps {
  selectedPack: BasePack | undefined;
  setSelectedPack: (pack: BasePack | undefined) => void;
  connection: Connection;
  migrate: () => void;
  migrating: boolean;
}

export default function MigrationDialog({
  selectedPack,
  setSelectedPack,
  connection,
  migrate,
  migrating,
}: MigrationDialogProps) {
  return (
    <AlertDialog
      open={selectedPack !== undefined}
      onOpenChange={() => setSelectedPack(undefined)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-500" />
            Confirm Base Pack Migration
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            Are you sure you want to change the base pack for{" "}
            <strong>{connection.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium">{connection.basePack.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium text-primary">
              {selectedPack?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border">
            <p className="font-medium text-red-700 dark:text-red-300 mb-1">
              Current Pack
            </p>
            <p className="text-xs">LCO: ₹{connection.basePack.lcoPrice}</p>
            <p className="text-xs">MRP: ₹{connection.basePack.customerPrice}</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border">
            <p className="font-medium text-green-700 dark:text-green-300 mb-1">
              New Pack
            </p>
            <p className="text-xs">LCO: ₹{selectedPack?.lcoPrice}</p>
            <p className="text-xs">MRP: ₹{selectedPack?.customerPrice}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          This action will create a migration record and update the customer's
          billing.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={migrate}
            className="bg-primary"
            disabled={migrating}
          >
            {migrating ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Confirm migration"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
