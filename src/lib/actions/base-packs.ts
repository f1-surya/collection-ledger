"use server";

import "server-only";
import { redirect } from "next/navigation";
import z from "zod";
import { authedFetch } from "../authed-fetch";
import { tryCatch } from "../try-catch";

const saveSchema = z.object({
  name: z.string().toUpperCase(),
  lcoPrice: z.coerce.number(),
  customerPrice: z.coerce.number(),
});

export async function saveBasePack(formData: FormData) {
  const { data, success } = saveSchema.safeParse({
    name: formData.get("name"),
    lcoPrice: formData.get("lcoPrice"),
    customerPrice: formData.get("customerPrice"),
  });

  if (!success) return;

  const { error } = await tryCatch(
    authedFetch("/pack", { method: "POST", body: JSON.stringify(data) }, true),
  );

  if (error) {
    console.error(error);
    redirect("/error");
  }

  redirect("/dashboard/base-packs");
}

export async function deleteBasePack(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) return;

  const { error } = await tryCatch(
    authedFetch(`/pack?id=${id}`, { method: "DELETE" }, true),
  );

  if (error) {
    console.error(error);
    redirect("/dashboard/base-packs?errorDelete=true");
  }

  redirect("/dashboard/base-packs");
}

const updateSchema = z.object({
  id: z.string(),
  name: z.string().toUpperCase(),
  lcoPrice: z.coerce.number(),
  customerPrice: z.coerce.number(),
});

export async function editBasePack(formData: FormData) {
  const { data, success } = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    lcoPrice: formData.get("lcoPrice"),
    customerPrice: formData.get("customerPrice"),
  });

  if (!success) return;

  const { error } = await authedFetch(
    "/pack",
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );

  if (error) {
    console.error(error);
    redirect("/dashboard/base-packs?errorEdit=true");
  }

  redirect("/dashboard/base-packs");
}
