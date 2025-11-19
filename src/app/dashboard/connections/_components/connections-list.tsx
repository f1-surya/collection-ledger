"use client";

import { isThisMonth } from "date-fns";
import { CircleCheckBig, CircleX, HelpCircle, TvMinimal } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import MyPagination from "@/components/my-pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Connection } from "./columns";
import CreateConnection from "./create";

const ConnectionDetails = dynamic(() => import("./connection-details"));

const ConnectionStatus = ({ lastPayment }: { lastPayment: Date | null }) => {
  let icon: ReactNode;
  let color: string;
  if (!lastPayment) {
    icon = <CircleX size={20} />;
    color = "bg-red-500";
  } else if (isThisMonth(lastPayment)) {
    icon = <CircleCheckBig size={20} />;
    color = "bg-green-500";
  } else {
    icon = <HelpCircle size={20} />;
    color = "bg-yellow-500";
  }
  return (
    <div
      className={`h-8 w-8 rounded-full ${color} p-1 flex items-center justify-center`}
    >
      {icon}
    </div>
  );
};

const ConnectionCard = ({
  connection,
  onClick,
}: {
  connection: Connection;
  onClick: (connectionId: string) => void;
}) => {
  const setConnection = useCallback(
    () => onClick(connection.id),
    [onClick, connection.id],
  );

  return (
    <button type="button" key={connection.id} onClick={setConnection}>
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <h3 className="font-semibold">{connection.name}</h3>
          <p className="text-muted-foreground text-sm">
            {connection.boxNumber}
          </p>
        </div>
        <ConnectionStatus lastPayment={connection.lastPayment} />
      </div>
      <div className="flex justify-between text-sm">
        <p>{connection.basePack.name}</p>
        <p>MRP: ₹{connection.basePack.customerPrice}</p>
      </div>
    </button>
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
          {connections.map((connection, i) => (
            <>
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onClick={showConnection}
              />
              {i !== 19 && <Separator />}
            </>
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
