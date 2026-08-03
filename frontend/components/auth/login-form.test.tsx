import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";
import { useLogin } from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  useLogin: jest.fn(),
}));

const mockedUseLogin = useLogin as jest.Mock;

describe("LoginForm", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    mutate.mockClear();
    mockedUseLogin.mockReturnValue({ mutate, isPending: false });
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("calls login.mutate with the entered credentials on valid submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mutate).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "Password123!",
    });
  });
});
