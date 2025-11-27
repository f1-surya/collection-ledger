import { Suspense } from "react";
import { QuickActions } from "@/components/quick-actions";
import { getOrg } from "@/lib/get-org";
import {
  LoadingRecentPayments,
  RecentPayments,
} from "./_components/recent-payments";
import { Summary, SummarySkeleton } from "./_components/summary";

export default async function Dashboard() {
  const org = await getOrg();
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <QuickActions />
      <Suspense fallback={<SummarySkeleton />}>
        <Summary orgId={org.id} />
      </Suspense>
      <Suspense fallback={<LoadingRecentPayments />}>
        <RecentPayments orgId={org.id} />
      </Suspense>
    </div>
  );
}
