"use client";

import { TvMinimal } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import MyPagination from "@/components/my-pagination";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import type { Connection } from "./columns";
import CreateConnection from "./create";

const ConnectionDetails = dynamic(() => import("./connection-details"));

const ConnectionCard = ({
  connection,
  now,
  onClick,
}: {
  connection: Connection;
  now: Date;
  onClick: (connectionId: string) => void;
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
  pages,
}: {
  connections: Connection[];
  pages: number;
}) {
  const [connections, setConnections] = useState(data);
  const [currConnection, setCurrConnection] = useState<
    Connection | undefined
  >();
  const now = useMemo(() => new Date(), []);
  const showConnection = useCallback(
    (connectionId: string) => {
      const found = connections.find((con) => con.id === connectionId);
      if (found) setCurrConnection(found);
    },
    [connections],
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 250);
  const t = useTranslations("Connections");

  useEffect(() => {
    setConnections(data);
  }, [data]);

  const markAsPaid = (connectionId: string) => {
    setConnections((prevCons) =>
      prevCons.map((con) =>
        con.id === connectionId ? { ...con, lastPayment: new Date() } : con,
      ),
    );
    setCurrConnection(undefined);
  };

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Enter name or smartcard"
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {connections.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <TvMinimal />
            </EmptyMedia>
            <EmptyTitle>{t("noConnectionsForQuery")}</EmptyTitle>
          </EmptyHeader>
          <CreateConnection />
        </Empty>
      ) : (
        <div className="flex flex-col space-y-2">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              now={now}
              onClick={showConnection}
            />
          ))}
        </div>
      )}
      <ConnectionDetails
        connection={currConnection}
        onOpenChange={setCurrConnection}
        callback={markAsPaid}
      />
      <MyPagination pages={pages} />
    </div>
  );
}
