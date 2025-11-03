"use client";

import { Package, PencilLine, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/forms/formfield";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { BasePack } from "./types";

export default function BasePackList({
  packs: defaultPacks,
}: {
  packs: BasePack[];
}) {
  const [packs, setPacks] = useState<BasePack[]>(defaultPacks);
  const [createPack, setCreatePack] = useState(false);
  const [packToDelete, setPackToDelete] = useState<BasePack | null>(null);
  const [packToEdit, setPackToEdit] = useState<BasePack | null>(null);
  const t = useTranslations("BasePack");

  const savePack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/packs", { method: "POST", body });
    toast.promise(prom, {
      loading: "Saving pack...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    if (res.status === 400) {
      const error = await res.json();
      toast.error(error.message);
    } else if (res.ok) {
      const newPack = await res.json();
      console.log(newPack);
      const newPacks: BasePack[] = [...packs, newPack];
      setPacks(newPacks.sort((a, b) => a.name.localeCompare(b.name)));
      setCreatePack(false);
    }
  };

  const editPack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/packs", { method: "PUT", body });

    toast.promise(prom, {
      loading: "Saving pack...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    if (res.status === 400) {
      const e = await res.json();
      toast.error(e.message);
    } else {
      const updatedPack = await res.json();
      setPacks((prev) =>
        // biome-ignore lint/style/noNonNullAssertion: If this event is fired then it won't be null.
        prev.map((pack) => (pack.id === packToEdit!.id ? updatedPack : pack)),
      );
      setPackToEdit(null);
    }
  };

  const deletePack = async () => {
    if (!packToDelete) return;

    const prom = fetch(`/api/packs?id=${packToDelete.id}`, {
      method: "DELETE",
    });
    toast.promise(prom, {
      loading: "Deleting pack...",
      success: `${packToDelete.name} has been deleted`,
      error: "Something went wrong",
    });

    const res = await prom;
    if (res.ok) {
      setPacks((prev) => prev.filter((p) => p.id !== packToDelete.id));
      setPackToDelete(null);
    }
  };

  return (
    <>
      {packs.length === 0 && (
        <Empty className="w-fit h-fit m-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
      {packs.length > 0 && (
        <h2 className="font-semibold text-xl p-2">{t("list")}:</h2>
      )}
      <ul className="space-y-4 mt-4">
        {packs.map((pack) => (
          <Card key={pack.id}>
            <CardHeader>
              <CardTitle>{pack.name}</CardTitle>
              <CardDescription>
                MRP: ₹{pack.customerPrice} | LCO: ₹{pack.lcoPrice}
                {pack.connections !== undefined &&
                  ` | Connections: ${pack.connections}`}
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPackToEdit(pack)}
                >
                  <PencilLine />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPackToDelete(pack)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
      <Dialog
        open={packToEdit !== null}
        onOpenChange={() => setPackToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editPack} className="space-y-4">
            <input name="id" type="hidden" value={packToEdit?.id} />
            <FormField
              id="name"
              label="Pack name"
              required
              defaultValue={packToEdit?.name}
            />
            <FormField
              id="lcoPrice"
              label="LCO price"
              required
              type="number"
              defaultValue={packToEdit?.lcoPrice.toString()}
            />
            <FormField
              id="customerPrice"
              label="MRP"
              required
              type="number"
              defaultValue={packToEdit?.customerPrice.toString()}
            />
            <DialogFooter className="mt-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={packToDelete !== null}
        onOpenChange={() => setPackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(
                (packToDelete?.connections ?? 0) === 0
                  ? "confirmDelete"
                  : "cantDelete",
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                (packToDelete?.connections ?? 0) === 0
                  ? "deleteDescription"
                  : "reason",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={deletePack}>
            <input name="id" type="hidden" value={packToDelete?.id} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {(packToDelete?.connections ?? 0) === 0 && (
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Creation dialog */}
      <Dialog open={createPack} onOpenChange={setCreatePack}>
        <DialogTrigger asChild>
          <Button className="fixed right-0 bottom-0 m-6 w-14 h-14">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addPack")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={savePack} className="space-y-4">
            <FormField id="name" label="Base pack name" required />
            <FormField id="lcoPrice" type="number" label="LCO price" required />
            <FormField id="customerPrice" type="number" label="MRP" required />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
