"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Connection } from "./columns";

const ConnectionsList = dynamic(() => import("./connections-list"));
const ConnectionsTable = dynamic(() => import("./connections-table"));

export default function Connections({
  connections,
}: {
  connections: Connection[];
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ConnectionsList connections={connections} />;
  }

  return <ConnectionsTable data={connections} />;
}
