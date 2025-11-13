"use client";

import { Download, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CreateConnection = dynamic(
  () => import("@/app/dashboard/connections/_components/create"),
);

export function QuickActions() {
  const [boxNumber, setBoxNumber] = useState("");
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <CreateConnection>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Connection
              </Button>
            </CreateConnection>
            <Button variant="outline" asChild>
              <a href="/api/payment/sheet" download>
                <Download className="mr-2 h-4 w-4" />
                Export Payments for This Month
              </a>
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Box Number"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
            />
            <Button
              onClick={() =>
                router.push(`/dashboard/connections/${boxNumber.toUpperCase()}`)
              }
            >
              View Connection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
