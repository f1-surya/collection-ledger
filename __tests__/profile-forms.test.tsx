import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserForm } from "@/app/dashboard/profile/_components/user-form";
import { CompanyForm } from "@/components/forms/company";

const mockUseActionState = vi.hoisted(() => vi.fn());

vi.mock("react", async (original) => {
  const actual = await original<typeof import("react")>();
  return {
    ...actual,
    useActionState: mockUseActionState,
  };
});

vi.mock("@/lib/actions/user", () => ({
  updateUser: vi.fn(),
}));

vi.mock("@/lib/actions/company", () => ({
  updateCompany: vi.fn(),
}));

describe("UserForm", () => {
  const mockFormAction = vi.fn(() => Promise.resolve({}));

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([{}, mockFormAction, false]);
  });

  it("should render the form with fields and default values", () => {
    const defaultValues = { name: "John Doe", email: "john@example.com" };
    const screen = render(<UserForm defaultValues={defaultValues} />);

    expect(screen.getByLabelText("Full name:")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email address:")).toHaveValue(
      "john@example.com",
    );
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("should render with errors and state values", () => {
    const nameError = "Name should have at least 2 characters.";
    const emailError = "Invalid email";

    mockUseActionState.mockReturnValue([
      {
        name: "J",
        email: "invalid",
        errors: {
          name: nameError,
          email: emailError,
        },
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<UserForm />);

    expect(screen.getByLabelText("Full name:")).toHaveValue("J");
    expect(screen.getByLabelText("Email address:")).toHaveValue("invalid");
    expect(screen.getByText(nameError)).toBeInTheDocument();
    expect(screen.getByText(emailError)).toBeInTheDocument();
  });

  it("should have disabled button when pending", () => {
    mockUseActionState.mockReturnValue([{}, mockFormAction, true]);

    const screen = render(<UserForm />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("CompanyForm", () => {
  const mockFormAction = vi.fn(() => Promise.resolve({}));

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([{}, mockFormAction, false]);
  });

  it("should render the form with fields and default values", () => {
    const defaultValues = {
      name: "Dalton Ltd.",
      email: "contact@dalton.com",
      phone: "+1234567890",
      address: "123 Main St",
    };
    const screen = render(<CompanyForm defaultValues={defaultValues} />);

    expect(screen.getByLabelText("Company name:")).toHaveValue("Dalton Ltd.");
    expect(screen.getByLabelText("Company email:")).toHaveValue(
      "contact@dalton.com",
    );
    expect(screen.getByLabelText("Company phone number:")).toHaveValue(
      "+1234567890",
    );
    expect(screen.getByLabelText("Company address:")).toHaveValue(
      "123 Main St",
    );
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("should render with errors and state values", () => {
    const nameError = "Company name should have at least 5 characters.";
    const emailError = "Invalid email";
    const phoneError = "Phone number should contain at least 10 digits.";
    const addressError = "Address should have at least 10 characters.";

    mockUseActionState.mockReturnValue([
      {
        name: "ABC",
        email: "invalid",
        phone: "123",
        address: "Short",
        errors: {
          name: nameError,
          email: emailError,
          phone: phoneError,
          address: addressError,
        },
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<CompanyForm />);

    expect(screen.getByLabelText("Company name:")).toHaveValue("ABC");
    expect(screen.getByLabelText("Company email:")).toHaveValue("invalid");
    expect(screen.getByLabelText("Company phone number:")).toHaveValue("123");
    expect(screen.getByLabelText("Company address:")).toHaveValue("Short");
    expect(screen.getByText(nameError)).toBeInTheDocument();
    expect(screen.getByText(emailError)).toBeInTheDocument();
    expect(screen.getByText(phoneError)).toBeInTheDocument();
    expect(screen.getByText(addressError)).toBeInTheDocument();
  });

  it("should have disabled button when pending", () => {
    mockUseActionState.mockReturnValue([{}, mockFormAction, true]);

    const screen = render(<CompanyForm />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
