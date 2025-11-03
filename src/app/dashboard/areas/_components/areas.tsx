"use client";

import { MapPin, PencilLine, Plus, Trash2 } from "lucide-react";
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
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export type Area = {
  id: string;
  name: string;
  connections: number;
};

export default function AreasList({ areas: defaulAreas }: { areas: Area[] }) {
  const [areas, setAreas] = useState<Area[]>(defaulAreas);
  const [createArea, setCreateArea] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [areaToEdit, setAreaToEdit] = useState<Area | null>(null);
  const t = useTranslations("Area");

  const saveArea = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/area", { method: "POST", body });
    toast.promise(prom, {
      loading: "Saving area...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    console.log(res.ok);
    if (res.status === 400) {
      const error = await res.json();
      toast.error(error.message);
    } else if (res.ok) {
      const newArea = await res.json();
      const newAreas: Area[] = [...areas, newArea];
      setAreas(newAreas.sort((a, b) => a.name.localeCompare(b.name)));
      setCreateArea(false);
    }
  };

  const editArea = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/area", { method: "PUT", body });

    toast.promise(prom, {
      loading: "Saving area...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    if (res.status === 400) {
      const e = await res.json();
      toast.error(e.message);
    } else {
      const updatedArea = await res.json();
      setAreas((prev) =>
        // biome-ignore lint/style/noNonNullAssertion: If this event is fired then it won't be null.
        prev.map((area) => (area.id === areaToEdit!.id ? updatedArea : area)),
      );
      setAreaToEdit(null);
    }
  };

  const deleteArea = async () => {
    if (!areaToDelete) return;

    const prom = fetch(`/api/area?id=${areaToDelete.id}`, { method: "DELETE" });
    toast.promise(prom, {
      loading: "Deleting area...",
      success: `${areaToDelete.name} has been deleted`,
      error: "Something went wrong",
    });

    const res = await prom;
    if (res.ok) {
      setAreas((prev) => prev.filter((a) => a.id !== areaToDelete.id));
      setAreaToDelete(null);
    }
  };

  return (
    <>
      {areas.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPin />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setCreateArea(true)}>Create area</Button>
          </EmptyContent>
        </Empty>
      )}
      {areas.length > 0 && (
        <h2 className="font-semibold text-xl p-2">{t("list")}:</h2>
      )}
      <ul className="space-y-4 mt-4">
        {areas.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
              <CardDescription>
                {area.connections}
                {t("connectionsCount")}
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreaToEdit(area)}
                >
                  <PencilLine />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreaToDelete(area)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
      <Dialog
        open={areaToEdit !== null}
        onOpenChange={() => setAreaToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editArea}>
            <input name="id" type="hidden" value={areaToEdit?.id} />
            <FormField
              id="name"
              label="Area name"
              required
              defaultValue={areaToEdit?.name}
            />
            <DialogFooter className="mt-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={areaToDelete !== null}
        onOpenChange={() => setAreaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(
                areaToDelete?.connections === 0
                  ? "confirmDelete"
                  : "cantDelete",
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                areaToDelete?.connections === 0
                  ? "deleteDescription"
                  : "reason",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={deleteArea}>
            <input name="id" type="hidden" value={areaToDelete?.id} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {areaToDelete?.connections === 0 && (
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Creation dialog */}
      <Dialog open={createArea} onOpenChange={setCreateArea}>
        <DialogTrigger asChild>
          <Button className="fixed right-0 bottom-0 m-6 w-14 h-14">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addArea")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveArea}>
            <FormField id="name" label="Area name" required />
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
