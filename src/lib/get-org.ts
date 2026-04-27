import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";

const resolveOrg = cache(async () => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  const orgId = session?.session.activeOrganizationId;

  if (orgId) {
    return { id: orgId };
  }

  const org = await auth.api.getFullOrganization({ headers: h });
  if (org) {
    return org;
  } else {
    const orgs = await auth.api.listOrganizations({ headers: h });
    const first = orgs[0];
    if (first) {
      await auth.api.setActiveOrganization({
        body: { organizationId: first.id },
        headers: h,
      });
      return first;
    }
  }

  redirect("/create-company");
});

export async function getOrg() {
  return resolveOrg();
}

export async function ensureOrgContext() {
  await resolveOrg();
}
