// @vitest-environment edge-runtime

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import handleSession from "@/lib/handle-session";

const mockedGet = vi.fn(() => ({ value: "token" })) as Mock<
  (key: string) => undefined | { value: string }
>;
const mockedSet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: mockedGet,
      set: mockedSet,
    }),
}));

const redirect = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("Stop");
  }),
);

vi.mock("next/navigation", () => ({ redirect }));

const mockedJson = vi.fn(() =>
  Promise.resolve({
    accessToken: "A Token",
    refreshToken: "R Token",
  }),
);
const mockFetchRes = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: mockedJson,
  }),
);

describe("Test handleSession", () => {
  beforeEach(() => {
    // @ts-expect-error
    vi.spyOn(global, "fetch").mockImplementation(mockFetchRes);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return from cookie jar", async () => {
    const token = await handleSession();

    expect(mockedGet).toHaveBeenCalled();
    expect(token).toBe("token");
  });

  it("should call redirect", async () => {
    mockedGet.mockReturnValue(undefined);

    try {
      await handleSession();
    } catch {}

    expect(redirect).toHaveBeenCalledWith("/login");
    expect(redirect).toThrow(Error);
  });

  it("should store the token from respones", async () => {
    mockedGet.mockImplementation((key) =>
      key === "access_token" ? undefined : { value: "token" },
    );
    const token = await handleSession();

    expect(mockFetchRes).toBeCalled();
    expect(mockedSet).toBeCalledWith("access_token", "A Token", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });
    expect(token).toBe("A Token");
  });

  it("should redirect to error when refresh token call fails", async () => {
    mockedGet.mockImplementation((key) =>
      key === "access_token" ? undefined : { value: "token" },
    );
    mockFetchRes.mockResolvedValue({ ok: false, json: mockedJson });

    try {
      await handleSession();
    } catch {}

    expect(redirect).toBeCalledWith("/error");
  });
});
