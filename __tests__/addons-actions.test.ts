import { beforeEach, describe, expect, it, vi } from "vitest";

const VALID_ID = "abcdefghijklmnopqrstu";

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  deleteFn: vi.fn(),
  connectionAddonFindFirst: vi.fn(),
  getOrg: vi.fn(() => Promise.resolve({ id: "org-123" })),
  nanoid: vi.fn(() => VALID_ID),
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    select: mocks.select,
    insert: mocks.insert,
    update: mocks.update,
    delete: mocks.deleteFn,
    query: {
      connectionAddons: {
        findFirst: mocks.connectionAddonFindFirst,
      },
    },
  },
}));

vi.mock("@/lib/get-org", () => ({
  getOrg: mocks.getOrg,
}));

vi.mock("nanoid", () => ({
  nanoid: mocks.nanoid,
}));

vi.mock("server-only", () => ({}));

const {
  connectAddon,
  createNewAddon,
  deleteAddon,
  getAddons,
  removeAddon,
  updateAddon,
} = await import("@/actions/addons");

function makeSelectChain<T>(rows: T) {
  const where = vi.fn().mockResolvedValue(rows);
  const from = vi.fn(() => ({ where }));
  return { where, from };
}

describe("addons actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAddons returns ordered addon list", async () => {
    const data = [{ id: VALID_ID, name: "SPORTS", connections: 2 }];
    const orderBy = vi.fn().mockResolvedValue(data);
    const groupBy = vi.fn(() => ({ orderBy }));
    const leftJoin = vi.fn(() => ({ groupBy }));
    const where = vi.fn(() => ({ leftJoin }));
    const from = vi.fn(() => ({ where }));
    mocks.select.mockReturnValue({ from });

    const result = await getAddons();

    expect(result).toEqual(data);
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });

  it("createNewAddon returns validation error for bad payload", async () => {
    const result = await createNewAddon({
      name: "AB",
      lcoPrice: "x",
      customerPrice: "2",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Wrong data format");
      expect(result.fieldErrors).toBeDefined();
    }
  });

  it("createNewAddon creates addon", async () => {
    const row = {
      id: VALID_ID,
      name: "SPORTS",
      lcoPrice: 10,
      customerPrice: 20,
      org: "org-123",
    };
    const returning = vi.fn().mockResolvedValue([row]);
    const values = vi.fn(() => ({ returning }));
    mocks.insert.mockReturnValue({ values });

    const result = await createNewAddon({
      name: "sports",
      lcoPrice: "10",
      customerPrice: "20",
    });

    expect(result).toEqual({ success: true, data: row });
    expect(values).toHaveBeenCalledWith({
      id: VALID_ID,
      name: "SPORTS",
      lcoPrice: 10,
      customerPrice: 20,
      org: "org-123",
    });
  });

  it("updateAddon returns validation error for bad payload", async () => {
    const result = await updateAddon({
      id: "bad",
      name: "TV",
      lcoPrice: "10",
      customerPrice: "20",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Validation error");
    }
  });

  it("updateAddon updates and returns row", async () => {
    const row = {
      id: VALID_ID,
      name: "MOVIES",
      lcoPrice: 30,
      customerPrice: 40,
    };
    const returning = vi.fn().mockResolvedValue([row]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    mocks.update.mockReturnValue({ set });

    const result = await updateAddon({
      id: VALID_ID,
      name: "movies",
      lcoPrice: "30",
      customerPrice: "40",
    });

    expect(result).toEqual({ success: true, data: row });
    expect(set).toHaveBeenCalledWith({
      name: "MOVIES",
      lcoPrice: 30,
      customerPrice: 40,
    });
  });

  it("deleteAddon blocks deletion when addon is used", async () => {
    const { from } = makeSelectChain([{ id: "ca-1" }]);
    mocks.select.mockReturnValue({ from });

    const result = await deleteAddon(VALID_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Some connections are still using this addon");
    }
  });

  it("deleteAddon deletes when unused", async () => {
    const { from } = makeSelectChain([]);
    mocks.select.mockReturnValue({ from });
    const where = vi.fn().mockResolvedValue(undefined);
    mocks.deleteFn.mockReturnValue({ where });

    const result = await deleteAddon(VALID_ID);

    expect(result).toEqual({ success: true });
    expect(mocks.deleteFn).toHaveBeenCalledTimes(1);
  });

  it("connectAddon validates id format", async () => {
    const result = await connectAddon("bad", VALID_ID);
    expect(result).toEqual({ success: false, error: "Provide a proper ID." });
  });

  it("connectAddon blocks duplicates", async () => {
    mocks.connectionAddonFindFirst.mockResolvedValue({ id: "ca-1" });

    const result = await connectAddon(VALID_ID, VALID_ID);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("already added");
    }
  });

  it("connectAddon errors when connection does not exist", async () => {
    mocks.connectionAddonFindFirst.mockResolvedValue(null);
    const first = makeSelectChain([]);
    const second = makeSelectChain([{ id: VALID_ID }]);
    mocks.select
      .mockReturnValueOnce({ from: first.from })
      .mockReturnValueOnce({ from: second.from });

    const result = await connectAddon(VALID_ID, VALID_ID);

    expect(result).toEqual({
      success: false,
      error: "The connection you've specified doesn't exist",
    });
  });

  it("connectAddon errors when addon does not exist", async () => {
    mocks.connectionAddonFindFirst.mockResolvedValue(null);
    const first = makeSelectChain([{ id: VALID_ID }]);
    const second = makeSelectChain([]);
    mocks.select
      .mockReturnValueOnce({ from: first.from })
      .mockReturnValueOnce({ from: second.from });

    const result = await connectAddon(VALID_ID, VALID_ID);

    expect(result).toEqual({
      success: false,
      error: "The addon you've specified doesn't exist",
    });
  });

  it("connectAddon creates connection addon", async () => {
    mocks.connectionAddonFindFirst.mockResolvedValue(null);
    const first = makeSelectChain([{ id: VALID_ID }]);
    const second = makeSelectChain([{ id: VALID_ID }]);
    mocks.select
      .mockReturnValueOnce({ from: first.from })
      .mockReturnValueOnce({ from: second.from });

    const inserted = [{ id: "ca-1", connection: VALID_ID, addon: VALID_ID }];
    const returning = vi.fn().mockResolvedValue(inserted);
    const values = vi.fn(() => ({ returning }));
    mocks.insert.mockReturnValue({ values });

    const result = await connectAddon(VALID_ID, VALID_ID);

    expect(result).toEqual({ success: true, data: inserted });
    expect(values).toHaveBeenCalledWith({
      id: VALID_ID,
      org: "org-123",
      connection: VALID_ID,
      addon: VALID_ID,
    });
  });

  it("removeAddon validates id format", async () => {
    const result = await removeAddon("bad");
    expect(result).toEqual({ success: false, error: "Provide a proper id" });
  });

  it("removeAddon deletes addon mapping", async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    mocks.deleteFn.mockReturnValue({ where });

    const result = await removeAddon(VALID_ID);

    expect(result).toEqual({ success: true });
    expect(mocks.deleteFn).toHaveBeenCalledTimes(1);
  });
});
