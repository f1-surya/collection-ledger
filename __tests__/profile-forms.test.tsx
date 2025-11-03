import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserForm } from "@/app/dashboard/profile/_components/user-form";
import { CompanyForm } from "@/components/forms/company";

const mockUpdateUser = vi.hoisted(() => vi.fn(() => Promise.resolve({})));
const mockUpdateOrganization = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({})),
);
const mockToastError = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    updateUser: mockUpdateUser,
    organization: {
      update: mockUpdateOrganization,
    },
  },
}));

vi.mock("sonner", () => ({ toast: { error: mockToastError } }));

describe("UserForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with fields and default values", () => {
    const screen = render(<UserForm name="John Doe" />);

    expect(screen.getByLabelText("Full name:")).toHaveValue("John Doe");
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("should call updateUser on form submit", () => {
    const screen = render(<UserForm />);

    const nameInput = screen.getByLabelText("Full name:");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    fireEvent.click(screen.getByRole("button"));

    expect(mockUpdateUser).toHaveBeenCalledWith({
      name: "Jane Doe",
    });
  });

  it("should show error toast on update failure", async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: "Update failed" } });

    const screen = render(<UserForm />);

    const nameInput = screen.getByLabelText("Full name:");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    fireEvent.click(screen.getByRole("button"));

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Update failed");
    });
  });
});

describe("CompanyForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with fields and default values", () => {
    const defaultValues = {
      name: "Dalton Ltd.",
      slug: "contact@dalton.com",
      phoneNumber: "+1234567890",
      address: "123 Main St",
    };
    const screen = render(<CompanyForm defaultValues={defaultValues} />);

    expect(screen.getByLabelText("Company name*:")).toHaveValue("Dalton Ltd.");
    expect(screen.getByLabelText("Company email*:")).toHaveValue(
      "contact@dalton.com",
    );
    expect(screen.getByLabelText("Company phone number*:")).toHaveValue(
      "+1234567890",
    );
    expect(screen.getByLabelText("Company address*:")).toHaveValue(
      "123 Main St",
    );
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("should call organization.update on successful submit", async () => {
    const screen = render(<CompanyForm />);

    const nameInput = screen.getByLabelText("Company name*:");
    const emailInput = screen.getByLabelText("Company email*:");
    const phoneInput = screen.getByLabelText("Company phone number*:");
    const addressInput = screen.getByLabelText("Company address*:");

    fireEvent.change(nameInput, { target: { value: "Dalton Ltd." } });
    fireEvent.change(emailInput, { target: { value: "contact@dalton.com" } });
    fireEvent.change(phoneInput, { target: { value: "+1234567890" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await vi.waitFor(() => {
      expect(mockUpdateOrganization).toHaveBeenCalledWith({
        data: {
          name: "Dalton Ltd.",
          slug: "contact@dalton.com",
          phoneNumber: "+1234567890",
          address: "123 Main St",
        },
      });
    });
  });

  it("should show error toast on update failure", async () => {
    mockUpdateOrganization.mockResolvedValue({
      error: { message: "Update failed" },
    });

    const screen = render(<CompanyForm />);

    const nameInput = screen.getByLabelText("Company name*:");
    const emailInput = screen.getByLabelText("Company email*:");
    const phoneInput = screen.getByLabelText("Company phone number*:");
    const addressInput = screen.getByLabelText("Company address*:");

    fireEvent.change(nameInput, { target: { value: "Dalton Ltd." } });
    fireEvent.change(emailInput, { target: { value: "contact@dalton.com" } });
    fireEvent.change(phoneInput, { target: { value: "+1234567890" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Update failed");
    });
  });
});
