import { redirect } from "@sveltejs/kit";
import { auth } from "./auth";

export async function getOrg(h: Headers) {
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

  redirect(308, "/create-company");
}
