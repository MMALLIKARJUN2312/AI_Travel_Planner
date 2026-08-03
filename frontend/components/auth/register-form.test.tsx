import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./register-form";
import { useRegister } from "@/hooks/use-auth";

jest.mock("@/hooks/use-auth", () => ({
  useRegister: jest.fn(),
}));

const mockedUseRegister = useRegister as jest.Mock;

describe("RegisterForm", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    mutate.mockClear();
    mockedUseRegister.mockReturnValue({ mutate, isPending: false });
  });

  it("renders name, email, and password fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows a validation error for a name that is too short", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("calls register.mutate with the entered values on valid submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mutate).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "Password123!",
    });
  });
});
