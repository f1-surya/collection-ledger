"use server";

import { redirect } from "next/navigation";
import { authedFetch } from "../authed-fetch";
import "server-only";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
import z from "zod";
import { tryCatch } from "../try-catch";

export async function saveArea(formData: FormData) {
  const areaName = formData.get("name")?.toString();
  if (!areaName) return;

  await authedFetch(
    "/area",
    {
      method: "POST",
      body: JSON.stringify({ name: areaName }),
    },
    true,
  );
  redirect("/dashboard/areas");
}

export async function deleteArea(formData: FormData) {
  const areaId = formData.get("id")?.toString();
  if (!areaId) return;

  const { error } = await tryCatch(
    authedFetch(`/area?id=${areaId}`, { method: "DELETE" }, true),
  );

  if (error) {
    console.error(error);
    redirect("/dashboard/areas?errorDelete=true");
  }

  redirect("/dashboard/areas");
}

const updateSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export async function editArea(formData: FormData) {
  const { data, success } = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!success) return;

  const { error } = await tryCatch(
    authedFetch("/area", { method: "PUT", body: JSON.stringify(data) }, true),
  );

  if (error) {
    console.error(error);
    redirect("/dashboard/areas?errorEdit=true");
  }

  redirect("/dashboard/areas");
}
