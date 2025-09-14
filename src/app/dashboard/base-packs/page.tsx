import { AlertCircleIcon, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FormField } from "@/components/forms/formfield";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveBasePack } from "@/lib/actions/base-packs";
import { authedFetch } from "@/lib/authed-fetch";
import { type BasePack, BasePackList } from "./_components/base-packs";

export default async function Packs({
  searchParams,
}: {
  searchParams: Promise<{ errorDelete: boolean; errorEdit: boolean }>;
}) {
  const { data: packs, error } = await authedFetch<BasePack[]>("/pack");
  const [params, t] = await Promise.all([
    searchParams,
    getTranslations("BasePack"),
  ]);

  if (error || !packs) {
    redirect("/error");
  }

  return (
    <main className="p-4">
      {(params.errorDelete || params.errorEdit) && (
        <Alert variant="destructive" className="mb-4 w-fit">
          <AlertCircleIcon />
          <AlertTitle>
            {t(params.errorDelete ? "deleteFailTitle" : "editFailTitle")}
          </AlertTitle>
          <AlertDescription>{t("deleteFailDescription")}</AlertDescription>
        </Alert>
      )}
      <BasePackList packs={packs} />
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed right-0 bottom-0 m-6 w-14 h-14">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addPack")}</DialogTitle>
          </DialogHeader>
          <form action={saveBasePack} className="space-y-4">
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
    </main>
  );
}
