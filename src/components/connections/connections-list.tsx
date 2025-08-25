import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import type { Connection } from "./columns";

export default function ConnectionsList({
  connections,
}: {
  connections: Connection[];
}) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(connections);
  const now = new Date();

  useEffect(() => {
    if (search.length === 0) {
      setFiltered(connections);
    } else {
      const searchString = search.toUpperCase();
      setFiltered(
        connections.filter(
          (connection) =>
            connection.name.includes(searchString) ||
            connection.boxNumber.includes(searchString),
        ),
      );
    }
  }, [search, connections]);

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        placeholder="Enter name or smartcard"
      />
      <ScrollArea className="h-[87dvh]">
        <div className="flex flex-col space-y-2">
          {filtered.map((connection) => {
            let color = "bg-red-600";
            if (connection.lastPayment) {
              const lastPayment = new Date(connection.lastPayment);
              if (
                lastPayment.getMonth() === now.getMonth() &&
                lastPayment.getFullYear() === now.getFullYear()
              ) {
                color = "bg-green-600";
              }
            }

            return (
              <Card key={connection.id}>
                <CardHeader>
                  <CardTitle>{connection.name}</CardTitle>
                  <CardDescription>{connection.boxNumber}</CardDescription>
                  <CardAction>
                    <div className={`w-4 h-4 rounded-full ${color} m-4`} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>{connection.basePack.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
