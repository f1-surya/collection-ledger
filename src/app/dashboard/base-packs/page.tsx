import { getBasePacks } from "@/lib/base-packs";
import BasePackList from "./_components/base-packs";

export default async function Packs() {
  const packs = await getBasePacks();

  return (
    <main className="p-4 h-dvh">
      <BasePackList packs={packs} />
    </main>
  );
}
