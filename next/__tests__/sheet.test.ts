import { describe, expect, it } from "vitest";
import { read } from "xlsx";
import { writeSheet } from "@/lib/sheet";

describe("writeSheet", () => {
  it("should create a valid Excel file with the provided data", () => {
    const data = {
      Sheet1: [
        ["A1", "B1"],
        ["A2", "B2"],
      ],
      Sheet2: [["X1"]],
    };

    const result = writeSheet(data);

    const workbook = read(result, { type: "buffer" });

    expect(workbook.SheetNames).toEqual(["Sheet1", "Sheet2"]);

    expect(workbook.Sheets.Sheet1.A1.v).toBe("A1");
    expect(workbook.Sheets.Sheet1.B1.v).toBe("B1");
    expect(workbook.Sheets.Sheet1.A2.v).toBe("A2");
    expect(workbook.Sheets.Sheet1.B2.v).toBe("B2");

    expect(workbook.Sheets.Sheet2.A1.v).toBe("X1");
  });

  it("should handle single sheet with empty rows", () => {
    const data = {
      EmptySheet: [],
    };

    const result = writeSheet(data);

    const workbook = read(result, { type: "buffer" });

    expect(workbook.SheetNames).toEqual(["EmptySheet"]);
    expect(workbook.Sheets.EmptySheet).toBeDefined();
  });
});
