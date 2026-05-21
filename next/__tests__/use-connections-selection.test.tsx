import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useConnectionsSelection } from "@/app/dashboard/connections/_components/connections-selections";

// Mock localStorage
let bulkPayValue: string | null = null;
const localStorageMock = {
  getItem: vi.fn((key: string) => (key === "bulkPay" ? bulkPayValue : null)),
  setItem: vi.fn((key: string, value: string) => {
    if (key === "bulkPay") bulkPayValue = value;
  }),
  removeItem: vi.fn((key: string) => {
    if (key === "bulkPay") bulkPayValue = null;
  }),
  clear: vi.fn(),
};

// The hook uses localStorage.bulkPay directly, so we need to mock it as a property
Object.defineProperty(localStorageMock, "bulkPay", {
  get: () => bulkPayValue,
  set: (value: string) => {
    bulkPayValue = value;
  },
});

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("useConnectionsSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bulkPayValue = null;
  });

  it("should initialize with empty selection when no localStorage data", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useConnectionsSelection());

    expect(result.current.selected).toEqual({});
  });

  it("should initialize with data from localStorage", () => {
    const storedData = { SMC001: true, SMC002: false };
    bulkPayValue = JSON.stringify(storedData);

    const { result } = renderHook(() => useConnectionsSelection());

    expect(result.current.selected).toEqual(storedData);
  });

  it("should handle invalid localStorage data gracefully", () => {
    localStorageMock.getItem.mockReturnValue("invalid json");

    const { result } = renderHook(() => useConnectionsSelection());

    expect(result.current.selected).toEqual({});
  });

  it("should update selected state", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    act(() => {
      result.current.setSelected({ SMC001: true });
    });

    expect(result.current.selected).toEqual({ SMC001: true });
  });

  it("should persist to localStorage when selected changes", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    act(() => {
      result.current.setSelected({ SMC001: true, SMC002: false });
    });

    expect(bulkPayValue).toBe(JSON.stringify({ SMC001: true, SMC002: false }));
  });

  it("should not persist empty object to localStorage", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    act(() => {
      result.current.setSelected({});
    });

    expect(bulkPayValue).toBeNull();
  });

  it("should clear selection and remove from localStorage", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    act(() => {
      result.current.setSelected({ SMC001: true });
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.selected).toEqual({});
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("bulkPay");
  });

  it("should return selected connection IDs via getConsToPay", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    act(() => {
      result.current.setSelected({ SMC001: true, SMC002: false, SMC003: true });
    });

    expect(result.current.getConsToPay()).toEqual(["SMC001", "SMC003"]);
  });

  it("should return empty array when no connections selected", () => {
    const { result } = renderHook(() => useConnectionsSelection());

    expect(result.current.getConsToPay()).toEqual([]);
  });
});
