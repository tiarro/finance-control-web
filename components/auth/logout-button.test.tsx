import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "./logout-button";
import { logout } from "@/app/(auth)/logout/actions";

// Mock the logout action
jest.mock("@/app/(auth)/logout/actions", () => ({
  logout: jest.fn(),
}));

describe("LogoutButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logout button with correct text", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Keluar" });
    expect(button).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Keluar" });
    expect(button).toHaveClass("text-gray-600");
    expect(button).toHaveClass("dark:text-gray-300");
    expect(button).toHaveClass("hover:text-red-600");
  });

  it("calls logout function when clicked", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(button);

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("calls logout function multiple times on multiple clicks", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Keluar" });

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(logout).toHaveBeenCalledTimes(3);
  });
});
