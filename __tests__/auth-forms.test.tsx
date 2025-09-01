import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm, SignupForm } from "@/components/forms/auth-forms";

const mockUseActionState = vi.hoisted(() => vi.fn());

vi.mock("react", async (original) => {
  const actual = await original<typeof import("react")>();
  return {
    ...actual,
    useActionState: mockUseActionState,
  };
});

vi.mock("@/lib/actions/auth", () => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

describe("LoginForm", () => {
  const mockFormAction = vi.fn(() => Promise.resolve({}));

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([{}, mockFormAction, false]);
  });

  it("should render the form with everything", () => {
    const screen = render(<LoginForm />);

    expect(screen.getByPlaceholderText("rick@dalton.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("MyStrong#Password23"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should render with errors and default values", async () => {
    const emailError = "No user is associated with this email.";
    const passwordError = "Password doesn't match";
    const error = "Something went wrong, please try again later.";

    mockUseActionState.mockReturnValue([
      {
        email: "example@mail.com",
        password: "password",
        emailError,
        passwordError,
        error,
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<LoginForm />);

    expect(screen.getByLabelText("Email:")).toHaveValue("example@mail.com");
    expect(screen.getByLabelText("Password:")).toHaveValue("password");
    expect(screen.getByText(emailError)).toBeInTheDocument();
    expect(screen.getByText(passwordError)).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it("should have disabled fields and button", () => {
    mockUseActionState.mockReturnValue([{}, mockFormAction, true]);

    const screen = render(<LoginForm />);

    expect(screen.getByLabelText("Email:")).toBeDisabled();
    expect(screen.getByLabelText("Password:")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call the form action", () => {
    mockUseActionState.mockReturnValue([
      {
        email: "example@mail.com",
        password: "password",
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<LoginForm />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockFormAction).toBeCalled();
  });
});

describe("SignupForm", () => {
  const mockFormAction = vi.fn(() => Promise.resolve({}));

  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockReturnValue([{}, mockFormAction, false]);
  });

  it("should have all the fields", () => {
    const screen = render(<SignupForm />);

    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter password again:")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Signup");
  });

  it("should render with values and errors", () => {
    mockUseActionState.mockReturnValue([
      {
        name: "Thomas",
        email: "tommy@peakyblinders.com",
        password: "password",
        passwordRepeat: "pasword",
        errors: {
          name: "Last name",
          email: "Old user",
          password: "Weak",
          passwordRepeat: "Not matching",
        },
        errorMessage: "Error",
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<SignupForm />);

    expect(screen.getByLabelText("Name:")).toHaveValue("Thomas");
    expect(screen.getByLabelText("Email:")).toHaveValue(
      "tommy@peakyblinders.com",
    );
    expect(screen.getByLabelText("Password:")).toHaveValue("password");
    expect(screen.getByLabelText("Enter password again:")).toHaveValue(
      "pasword",
    );

    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Old user")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText("Not matching")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should have disabled fields and button", () => {
    mockUseActionState.mockReturnValue([{}, mockFormAction, true]);

    const screen = render(<SignupForm />);

    expect(screen.getByLabelText("Name:")).toBeDisabled();
    expect(screen.getByLabelText("Email:")).toBeDisabled();
    expect(screen.getByLabelText("Password:")).toBeDisabled();
    expect(screen.getByLabelText("Enter password again:")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call form action", () => {
    mockUseActionState.mockReturnValue([
      {
        name: "Thomas",
        email: "tommy@peakyblinders.com",
        password: "password",
        passwordRepeat: "password",
      },
      mockFormAction,
      false,
    ]);

    const screen = render(<SignupForm />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockFormAction).toBeCalled();
  });
});
