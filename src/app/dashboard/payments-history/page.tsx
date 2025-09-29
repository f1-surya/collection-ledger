import { authedFetch } from "@/lib/authed-fetch";
import type { Payment } from "../connections/[boxNumber]/_components/types";
import PaymentList from "./_components/payment-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = await searchParams;
  const now = new Date();
  const startDate = start
    ? new Date(start)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = end ? new Date(end) : now;

  if (startDate > endDate) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Invalid Date Range</h1>
      </main>
    );
  }

  const queryParams = new URLSearchParams();
  queryParams.set("start", startDate.toISOString());
  queryParams.set("end", endDate.toISOString());

  const { data, error } = await authedFetch<Payment[]>(
    `/payment?${queryParams}`,
  );

  if (error) {
    console.error(error);
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error Fetching Payments</h1>
      </main>
    );
  }

  return <PaymentList defaultPayments={data} />;
}
