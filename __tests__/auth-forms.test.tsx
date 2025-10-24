import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm, SignupForm } from "@/components/forms/auth-forms";

const mockSignIn = vi.hoisted(() => vi.fn(() => Promise.resolve({})));
const mockSignUp = vi.hoisted(() => vi.fn(() => Promise.resolve({})));
const mockToastError = vi.hoisted(() => vi.fn());
const mockPush = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: mockSignIn },
    signUp: { email: mockSignUp },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("sonner", () => ({ toast: { error: mockToastError } }));

describe("LoginForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockReturnValue(Promise.resolve({}));
  });

  it("should render the form with everything", () => {
    const screen = render(<LoginForm />);

    expect(screen.getByPlaceholderText("rick@dalton.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Strong#Password12"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should call the form action", () => {
    const screen = render(<LoginForm />);

    const email = screen.getByLabelText("Email:");
    fireEvent.change(email, { target: { value: "some@mail.com" } });

    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "Password1!" } });

    fireEvent.click(screen.getByRole("button"));
    expect(mockSignIn).toBeCalled();
  });

  it("should call the toaster with error message", async () => {
    mockSignIn.mockReturnValue(
      Promise.resolve({ error: { message: "Wrong password" } }),
    );

    const screen = render(<LoginForm />);

    const email = screen.getByLabelText("Email:");
    fireEvent.change(email, { target: { value: "some@mail.com" } });

    const password = screen.getByLabelText("Password:");
    fireEvent.change(password, { target: { value: "Password1!" } });

    fireEvent.click(screen.getByRole("button"));

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Wrong password");
    });
  });
});

describe("SignupForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignUp.mockResolvedValue({});
  });

  it("should render all fields properly", () => {
    const screen = render(<SignupForm />);

    expect(screen.getByLabelText("Name*:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email*:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password*:")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter password again*:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  it("should render all errors properly by typing bad data", async () => {
    const screen = render(<SignupForm />);

    const nameInput = screen.getByLabelText("Name*:");
    const emailInput = screen.getByLabelText("Email*:");
    const passwordInput = screen.getByLabelText("Password*:");
    const passwordRepeatInput = screen.getByLabelText("Enter password again*:");

    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, {
      target: { value: "Strong@Password123" },
    });
    fireEvent.change(passwordRepeatInput, {
      target: { value: "Different@Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await vi.waitFor(() => {
      expect(
        screen.getByText("Name must be at least 3 characters long"),
      ).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  it("should call auth.signUp.email and router.push on successful signup", async () => {
    const screen = render(<SignupForm />);

    const nameInput = screen.getByLabelText("Name*:");
    const emailInput = screen.getByLabelText("Email*:");
    const passwordInput = screen.getByLabelText("Password*:");
    const passwordRepeatInput = screen.getByLabelText("Enter password again*:");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "Strong@Password123" },
    });
    fireEvent.change(passwordRepeatInput, {
      target: { value: "Strong@Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await vi.waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "Strong@Password123",
        passwordRepeat: "Strong@Password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/create-company");
    });
  });

  it("should pass errors from auth.signUp.email to toast.error", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "User already exists" } });

    const screen = render(<SignupForm />);

    const nameInput = screen.getByLabelText("Name*:");
    const emailInput = screen.getByLabelText("Email*:");
    const passwordInput = screen.getByLabelText("Password*:");
    const passwordRepeatInput = screen.getByLabelText("Enter password again*:");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "Strong@Password123" },
    });
    fireEvent.change(passwordRepeatInput, {
      target: { value: "Strong@Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await vi.waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("User already exists");
    });
  });
});
