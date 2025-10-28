import { getAreas } from "@/lib/area";
import AreasList from "./_components/areas";

export default async function Areas() {
  const areas = await getAreas();

  return (
    <main className="p-4">
      {/* @ts-expect-error */}
      <AreasList areas={areas} />
    </main>
  );
}
