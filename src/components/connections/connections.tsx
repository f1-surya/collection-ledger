"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { type Connection, columns } from "./columns";
import ConnectionsList from "./connections-list";
import { ConnectionTable } from "./connections-table";

export default function ConnectionView({
  connections,
}: {
  connections: Connection[];
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ConnectionsList connections={connections} />;
  }

  return <ConnectionTable columns={columns} data={connections} />;
}
