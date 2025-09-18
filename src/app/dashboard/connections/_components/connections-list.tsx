"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Connection } from "./columns";
import { ConnectionDetails } from "./connection-details";
import CreateConnection from "./create";

const ConnectionCard = ({
  connection,
  now,
  onClick,
}: {
  connection: Connection;
  now: Date;
  onClick: (connectionId: number) => void;
}) => {
  const setConnection = useCallback(
    () => onClick(connection.id),
    [onClick, connection.id],
  );

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
    <Card key={connection.id} onClick={setConnection}>
      <CardHeader>
        <CardTitle>{connection.name}</CardTitle>
        <CardDescription>{connection.boxNumber}</CardDescription>
        <CardAction>
          <div className={`w-4 h-4 rounded-full ${color} m-4`} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-between text-sm font-semibold">
        <p>{connection.basePack.name}</p>
        <p>MRP: ₹{connection.basePack.customerPrice}</p>
      </CardContent>
    </Card>
  );
};

export default function ConnectionsList({
  connections: data,
}: {
  connections: Connection[];
}) {
  const [connections, setConnections] = useState(data);
  const [search, setSearch] = useState("");
  const [newConnection, setNewConnection] = useState(false);
  const [currConnection, setCurrConnection] = useState<
    Connection | undefined
  >();
  const now = useMemo(() => new Date(), []);
  const filtered = useMemo(() => {
    if (search.length === 0) {
      return connections;
    }

    const searchString = search.toUpperCase();
    return connections.filter(
      (connection) =>
        connection.name.includes(searchString) ||
        connection.boxNumber.includes(searchString),
    );
  }, [search, connections]);
  const showConnection = useCallback(
    (connectionId: number) => {
      const found = connections.find((con) => con.id === connectionId);
      if (found) setCurrConnection(found);
    },
    [connections],
  );
  const t = useTranslations("Connections");

  const markAsPaid = (connectionId: number) => {
    setConnections((prevCons) =>
      prevCons.map((con) =>
        con.id === connectionId
          ? { ...con, lastPayment: new Date().toISOString() }
          : con,
      ),
    );
    setCurrConnection(undefined);
  };

  return (
    <div className="space-y-4">
      {connections.length === 0 ? (
        <div className="text-center">{t("noConnections")}</div>
      ) : (
        <>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Enter name or smartcard"
          />
          <ScrollArea className="h-[87dvh]">
            <div className="flex flex-col space-y-2">
              {filtered.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  now={now}
                  onClick={showConnection}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      <Button
        className="absolute right-0 bottom-0 m-6 w-14 h-14"
        size="icon"
        onClick={() => setNewConnection(!newConnection)}
      >
        <Plus />
      </Button>
      <CreateConnection open={newConnection} onOpenChange={setNewConnection} />
      <ConnectionDetails
        connection={currConnection}
        onOpenChange={setCurrConnection}
        callback={markAsPaid}
      />
    </div>
  );
}
