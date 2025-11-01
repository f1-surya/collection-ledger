import { utils, write } from "xlsx";

export function writeSheet(data: { [key: string]: string[][] }) {
  const workbook = utils.book_new();

  for (const key in data) {
    const sheet = utils.aoa_to_sheet(data[key]);
    utils.book_append_sheet(workbook, sheet, key);
  }

  return write(workbook, { type: "buffer", bookType: "xlsx" });
}
