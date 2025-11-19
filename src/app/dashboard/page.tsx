import { Suspense } from "react";
import { QuickActions } from "@/components/quick-actions";
import {
  LoadingRecentPayments,
  RecentPayments,
} from "./_components/recent-payments";
import { Summary, SummarySkeleton } from "./_components/summary";

export default async function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <QuickActions />
      <Suspense fallback={<SummarySkeleton />}>
        <Summary />
      </Suspense>
      <Suspense fallback={<LoadingRecentPayments />}>
        <RecentPayments />
      </Suspense>
    </div>
  );
}
