import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { read, utils } from "xlsx";
import { db } from "@/db/drizzle";
import { areas, basePacks, connections, payments } from "@/db/schema";
import { getOrg } from "@/lib/get-org";
import { writeSheet } from "@/lib/sheet";

export async function GET() {
  const org = await getOrg();
  const [conns, pmnts] = await Promise.all([
    db.query.connections.findMany({
      where: eq(connections.org, org.id),
      with: {
        area: true,
        basePack: true,
      },
    }),
    db.query.payments.findMany({
      where: eq(payments.org, org.id),
      with: {
        connection: true,
        currentPack: true,
        to: true,
      },
    }),
  ]);

  const sheetData = {
    Connections: [
      ["NAME", "SMARTCARD", "ADDRESS", "PACKAGE"],
      ...conns.map((conn) => [
        conn.name,
        conn.boxNumber,
        conn.area.name,
        conn.basePack.name,
      ]),
    ],
    Payments: [
      [
        "NAME",
        "SMARTCARD",
        "DATE",
        "IS MIGRATION",
        "CURRENT-PACK",
        "TO PACK",
        "LCO PRICE",
        "CUSTOMER PRICE",
      ],
      ...pmnts.map((pmnt) => [
        pmnt.connection.name,
        pmnt.connection.boxNumber,
        format(pmnt.date, "dd-MMM-yyyy h:m a"),
        String(pmnt.isMigration),
        pmnt.currentPack.name,
        pmnt.to?.name ?? "",
        pmnt.lcoPrice.toString(),
        pmnt.customerPrice.toString(),
      ]),
    ],
  };

  return new NextResponse(Buffer.from(writeSheet(sheetData)), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

export async function POST(request: Request) {
  const org = await getOrg();

  console.log(`Starting data import for org: ${org.id}`);

  const workbook = read(await request.arrayBuffer(), { type: "buffer" });
  const sheet = workbook.Sheets.Sheet1;
  const jsonData = utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  // @ts-expect-error - Type wil be unknown
  const cleanData = jsonData.filter((row: string[]) =>
    row.some((cell) => cell !== ""),
  ) as string[][];
  const header = cleanData.shift();

  if (!header) {
    console.log(`Import failed: Sheet is empty for org: ${org.id}`);
    return NextResponse.json({ message: "Sheet is empty" }, { status: 400 });
  }

  const cols = header.reduce(
    (acc, val, i) => {
      acc[val.toLowerCase()] = i;
      return acc;
    },
    {} as { [key: string]: number },
  );

  // Initialize counters and tracking
  let processedRows = 0;
  let skippedDuplicates = 0;
  let createdAreas = 0;
  let createdPacks = 0;
  const skippedBoxNumbers: string[] = [];

  await db.transaction(async (tx) => {
    // Pre-fetch all existing boxNumbers for duplicate checking
    const existingBoxNumbers = new Set(
      (
        await tx
          .select({ boxNumber: connections.boxNumber })
          .from(connections)
          .where(eq(connections.org, org.id))
      ).map((row) => row.boxNumber),
    );

    const availableAreas = (
      await tx
        .select({ name: areas.name, id: areas.id })
        .from(areas)
        .where(eq(areas.org, org.id))
    ).reduce(
      (acc, val) => {
        acc[val.name] = val.id;
        return acc;
      },
      {} as { [key: string]: string },
    );
    const availablePacks = (
      await tx
        .select({ name: basePacks.name, id: basePacks.id })
        .from(basePacks)
        .where(eq(basePacks.org, org.id))
    ).reduce(
      (acc, val) => {
        acc[val.name] = val.id;
        return acc;
      },
      {} as { [key: string]: string },
    );

    const connectionInserts: (typeof connections.$inferInsert)[] = [];

    for (const row of cleanData) {
      processedRows++;

      // Check for duplicate boxNumber using pre-fetched data
      if (existingBoxNumbers.has(row[cols.smartcard])) {
        skippedDuplicates++;
        skippedBoxNumbers.push(row[cols.smartcard]);
        console.warn(`Skipping duplicate boxNumber: ${row[cols.smartcard]}`);
        continue;
      }

      const areaName = row[cols.address];
      let currArea = availableAreas[areaName];
      if (!currArea) {
        const newArea = (
          await tx
            .insert(areas)
            .values({ id: nanoid(), name: areaName, org: org.id })
            .returning()
        )[0];
        availableAreas[newArea.name] = newArea.id;
        currArea = newArea.id;
        createdAreas++;
      }
      const packName = row[cols.package];
      let currPack = availablePacks[packName];
      if (!currPack) {
        const newPack = (
          await tx
            .insert(basePacks)
            .values({
              id: nanoid(),
              name: packName,
              lcoPrice: 35,
              customerPrice: 150,
              org: org.id,
            })
            .returning()
        )[0];
        availablePacks[newPack.name] = newPack.id;
        currPack = newPack.id;
        createdPacks++;
      }

      // Collect connection for batch insert
      connectionInserts.push({
        id: nanoid(),
        name: row[cols.name],
        boxNumber: row[cols.smartcard],
        area: currArea,
        basePack: currPack,
        org: org.id,
      });
    }

    // Batch insert connections
    if (connectionInserts.length > 0) {
      await tx.insert(connections).values(connectionInserts);
    }
  });

  console.log(
    `Import completed: ${processedRows} rows processed, ${skippedDuplicates} duplicates skipped, ${createdAreas} areas created, ${createdPacks} packs created`,
  );

  return NextResponse.json({
    message: "Data imported successfully",
    stats: {
      processedRows,
      skippedDuplicates,
      createdAreas,
      createdPacks,
      skippedBoxNumbers,
    },
  });
}
