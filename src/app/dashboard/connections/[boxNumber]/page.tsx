import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authedFetch } from "@/lib/authed-fetch";
import type { Connection } from "../_components/columns";
import { Details } from "./_components/details";
import type { Payment } from "./_components/types";

export default async function ConnectionInfo({
  params,
}: {
  params: Promise<{ boxNumber: string }>;
}) {
  const { boxNumber } = await params;

  const [
    { data: connection, error: connectionError },
    { data: payments, error: paymentsError },
  ] = await Promise.all([
    authedFetch<Connection>(`/connection/${boxNumber}`),
    authedFetch<Payment[]>(`/payment/${boxNumber}`),
  ]);

  if (connectionError) {
    if (connectionError.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center m-2 text-center">
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <AlertCircle size={32} className="text-destructive" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Connection Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The connection you're looking for doesn't exist or may have been
                removed.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/dashboard/connections">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Connections
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  if (paymentsError || connectionError) redirect("/error");

  return <Details currConnection={connection} currPayments={payments} />;
}
