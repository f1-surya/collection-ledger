import { getAddons } from "@/actions/addons";
import AddonList from "./_components/addons";

export default async function Addons() {
  const addons = await getAddons();

  return (
    <main className="p-4 h-dvh">
      <AddonList addons={addons} />
    </main>
  );
}
