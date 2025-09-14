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
import { saveArea } from "@/lib/actions/area";
import { authedFetch } from "@/lib/authed-fetch";
import type { Area } from "./_components/areas";
import AreasList from "./_components/areas";

export default async function Areas({
  searchParams,
}: {
  searchParams: Promise<{ errorDelete?: boolean; errorEdit?: boolean }>;
}) {
  const { data: areas, error } = await authedFetch<Area[]>("/area");
  const [params, t] = await Promise.all([
    searchParams,
    getTranslations("Area"),
  ]);

  if (error || !areas) {
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
      <h2 className="font-semibold text-xl p-2">{t("list")}:</h2>
      <AreasList areas={areas} />
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed right-0 bottom-0 m-6 w-14 h-14">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addArea")}</DialogTitle>
          </DialogHeader>
          <form action={saveArea}>
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
    </main>
  );
}
