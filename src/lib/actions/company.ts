"use server";

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

interface CompanyFormState {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  errors?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  error?: string;
}

const companySchema = z.object({
  name: z.string().min(10).trim(),
  email: z.email(),
  phone: z.string().min(10).trim(),
  address: z.string().min(10).trim(),
});

export async function saveCompany(
  _pref: CompanyFormState,
  formData: FormData,
): Promise<CompanyFormState> {
  const cookieJar = await cookies();
  const data = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    phone: formData.get("phone")?.toString(),
    address: formData.get("address")?.toString(),
  };

  const validation = companySchema.safeParse(data);
  if (!validation.success) {
    const errors = z.flattenError(validation.error).fieldErrors;
    return {
      errors: {
        name: (errors.name ?? [])[0],
        email: (errors.email ?? [])[0],
        phone: (errors.phone ?? [])[0],
        address: (errors.address ?? [])[0],
      },
      ...data,
    };
  }

  const res = await fetch(`${process.env.API_URL}/company`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cookieJar.get("access_token")?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validation.data),
  });

  if (res.ok) {
    redirect("/dashboard");
  } else {
    const resData = await res.json();
    return {
      errors: {
        name: resData.name,
        email: resData.email,
        phone: resData.phone,
        address: resData.address,
      },
      error: resData.message,
      ...data,
    };
  }

  return { ...data, error: "Something went wrong, please try again." };
}
