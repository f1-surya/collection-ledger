"use client";

import { Download, Plus, Search } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const router = useRouter();

  const navigate = () => {
    router.push(`/dashboard/connections?search=${search.toUpperCase()}`);
  };

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
              placeholder="Enter Box Number or Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  navigate();
                }
              }}
            />
            <Button onClick={navigate} size="icon">
              <Search />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
