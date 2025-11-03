import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getOrg(currentPath?: string) {
  const h = await headers();
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

  if (currentPath !== "/create-company") {
    redirect("/create-company");
  }
}
