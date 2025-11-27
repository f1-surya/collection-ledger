import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/payment/bulk/route";

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  where: vi.fn(),
  innerJoin: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  transaction: vi.fn(),
  getOrg: vi.fn(() => Promise.resolve({ id: "org-123" })),
  nanoid: vi.fn(() => "payment-123"),
  isThisMonth: vi.fn(),
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    select: mocks.select,
    insert: mocks.insert,
    update: mocks.update,
    transaction: mocks.transaction,
  },
}));

vi.mock("@/lib/get-org", () => ({
  getOrg: mocks.getOrg,
}));

vi.mock("nanoid", () => ({
  nanoid: mocks.nanoid,
}));

vi.mock("date-fns", () => ({
  isThisMonth: mocks.isThisMonth,
}));

vi.mock("@/lib/get-org", () => ({
  getOrg: mocks.getOrg,
}));

vi.mock("nanoid", () => ({
  nanoid: mocks.nanoid,
}));

vi.mock("date-fns", () => ({
  isThisMonth: mocks.isThisMonth,
}));

describe("POST /api/payment/bulk", () => {
  const mockConnections = [
    {
      id: "conn-1",
      name: "Connection 1",
      boxNumber: "SMC001",
      lastPayment: null,
      basePack: {
        id: "pack-1",
        lcoPrice: 100,
        customerPrice: 150,
      },
    },
    {
      id: "conn-2",
      name: "Connection 2",
      boxNumber: "SMC002",
      lastPayment: new Date(),
      basePack: {
        id: "pack-2",
        lcoPrice: 200,
        customerPrice: 250,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.transaction.mockImplementation((fn: (tx: any) => Promise<void>) =>
      fn({
        update: mocks.update,
        insert: mocks.insert,
      }),
    );
  });

  it("should return 409 for invalid input", async () => {
    const req = {
      json: vi.fn(() => Promise.resolve({})),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.message).toBe("Please provide SMCs list to pay.");
  });

  it("should return 409 for empty smcs array", async () => {
    const req = {
      json: vi.fn(() => Promise.resolve({ smcs: [] })),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.message).toBe("Please provide SMCs list to pay.");
  });

  it("should process bulk payments successfully", async () => {
    // Mock date-fns to return true for connection 2 (already paid this month)
    mocks.isThisMonth.mockReturnValue(true);

    // Mock DB queries
    mocks.select.mockReturnValue({
      from: vi.fn(() => ({
        where: mocks.where,
      })),
    });
    mocks.where.mockReturnValue({
      innerJoin: mocks.innerJoin,
    });
    mocks.innerJoin.mockResolvedValue(mockConnections);

    mocks.insert.mockReturnValue({
      values: vi.fn(),
    });
    mocks.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    });

    const req = {
      json: vi.fn(() => Promise.resolve({ smcs: ["SMC001", "SMC002"] })),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.paid).toEqual([["Connection 1", "SMC001"]]);
    expect(data.ignored).toEqual([["Connection 2", "SMC002"]]);

    // Verify transaction was called
    expect(mocks.transaction).toHaveBeenCalled();

    // Verify insert was called with correct payment data
    expect(mocks.insert).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should handle connections already paid this month", async () => {
    const paidConnections = [
      {
        ...mockConnections[0],
        lastPayment: new Date(), // Both have payment this month
      },
      mockConnections[1],
    ];

    mocks.isThisMonth.mockReturnValue(true); // Both are considered paid this month

    mocks.select.mockReturnValue({
      from: vi.fn(() => ({
        where: mocks.where,
      })),
    });
    mocks.where.mockReturnValue({
      innerJoin: mocks.innerJoin,
    });
    mocks.innerJoin.mockResolvedValue(paidConnections);

    const req = {
      json: vi.fn(() => Promise.resolve({ smcs: ["SMC001", "SMC002"] })),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.paid).toEqual([]);
    expect(data.ignored).toEqual([
      ["Connection 1", "SMC001"],
      ["Connection 2", "SMC002"],
    ]);

    // Transaction should not be called when no payments to make
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("should handle connections that have never been paid", async () => {
    const neverPaidConnections = [
      {
        ...mockConnections[0],
        lastPayment: null, // Never paid
      },
      {
        ...mockConnections[1],
        lastPayment: null, // Never paid
      },
    ];

    mocks.isThisMonth.mockReturnValue(false); // Not relevant for null dates

    mocks.select.mockReturnValue({
      from: vi.fn(() => ({
        where: mocks.where,
      })),
    });
    mocks.where.mockReturnValue({
      innerJoin: mocks.innerJoin,
    });
    mocks.innerJoin.mockResolvedValue(neverPaidConnections);

    mocks.insert.mockReturnValue({
      values: vi.fn(),
    });
    mocks.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    });

    const req = {
      json: vi.fn(() => Promise.resolve({ smcs: ["SMC001", "SMC002"] })),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.paid).toEqual([
      ["Connection 1", "SMC001"],
      ["Connection 2", "SMC002"],
    ]);
    expect(data.ignored).toEqual([]);

    // Verify transaction was called
    expect(mocks.transaction).toHaveBeenCalled();
  });

  it("should handle mixed payment scenarios correctly", async () => {
    const mixedConnections = [
      {
        ...mockConnections[0],
        lastPayment: null, // Should be paid
      },
      {
        ...mockConnections[1],
        lastPayment: new Date(), // Already paid this month, should be ignored
      },
      {
        id: "conn-3",
        name: "Connection 3",
        boxNumber: "SMC003",
        lastPayment: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // Paid last month, should be paid
        basePack: {
          id: "pack-3",
          lcoPrice: 300,
          customerPrice: 350,
        },
      },
    ];

    // Mock isThisMonth: true for recent date (connection 2), false for old date (connection 3)
    mocks.isThisMonth
      .mockReturnValueOnce(true) // recent date (connection 2)
      .mockReturnValueOnce(false); // old date (connection 3)

    mocks.select.mockReturnValue({
      from: vi.fn(() => ({
        where: mocks.where,
      })),
    });
    mocks.where.mockReturnValue({
      innerJoin: mocks.innerJoin,
    });
    mocks.innerJoin.mockResolvedValue(mixedConnections);

    mocks.insert.mockReturnValue({
      values: vi.fn(),
    });
    mocks.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    });

    const req = {
      json: vi.fn(() =>
        Promise.resolve({ smcs: ["SMC001", "SMC002", "SMC003"] }),
      ),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.paid).toEqual([
      ["Connection 1", "SMC001"],
      ["Connection 3", "SMC003"],
    ]);
    expect(data.ignored).toEqual([["Connection 2", "SMC002"]]);

    // Verify transaction was called
    expect(mocks.transaction).toHaveBeenCalled();
  });

  it("should handle no connections found in database", async () => {
    mocks.select.mockReturnValue({
      from: vi.fn(() => ({
        where: mocks.where,
      })),
    });
    mocks.where.mockReturnValue({
      innerJoin: mocks.innerJoin,
    });
    mocks.innerJoin.mockResolvedValue([]); // No connections found

    const req = {
      json: vi.fn(() => Promise.resolve({ smcs: ["SMC999"] })),
    } as unknown as NextRequest;

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.paid).toEqual([]);
    expect(data.ignored).toEqual([]);

    // Transaction should not be called
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
