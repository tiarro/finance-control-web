import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

describe("AuthForm Component", () => {
  const mockFields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "email@anda.com",
    },
    {
      id: "password",
      label: "Kata Sandi",
      type: "password",
      placeholder: "masukkan kata sandi anda",
    },
  ];

  const defaultProps = {
    title: "Masuk",
    description: "Kontrol Finansial yang Mudah",
    fields: mockFields,
    buttonText: "Masuk",
    footerText: "Belum punya akun?",
    footerLinkText: "Daftar",
    footerLinkHref: "/register",
  };

  it("renders the form with title and description", () => {
    render(<AuthForm {...defaultProps} />);

    expect(screen.getByText("HematKuy")).toBeInTheDocument();
    expect(
      screen.getByText("Kontrol Finansial yang Mudah")
    ).toBeInTheDocument();
  });

  it("renders all form fields correctly", () => {
    render(<AuthForm {...defaultProps} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Kata Sandi")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@anda.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("masukkan kata sandi anda")
    ).toBeInTheDocument();
  });

  it("renders submit button with correct text", () => {
    render(<AuthForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: "Masuk" });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("renders footer with link to register", () => {
    render(<AuthForm {...defaultProps} />);

    expect(screen.getByText("Belum punya akun?")).toBeInTheDocument();
    const registerLink = screen.getByRole("link", { name: "Daftar" });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("calls onSubmit when form is submitted", async () => {
    const mockSubmit = jest.fn((e) => e.preventDefault());
    const user = userEvent.setup();

    render(<AuthForm {...defaultProps} onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: "Masuk" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders children when provided", () => {
    render(
      <AuthForm {...defaultProps}>
        <div data-testid="error-message">Error occurred</div>
      </AuthForm>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("displays copyright text with current year", () => {
    render(<AuthForm {...defaultProps} />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} HematKuy. Hak cipta dilindungi.`)
    ).toBeInTheDocument();
  });

  it("all input fields are required", () => {
    render(<AuthForm {...defaultProps} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata Sandi");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
