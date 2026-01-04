import { redirect } from "next/navigation";

// This is a server component, so we can perform the redirect here
export default function HomePage() {
  // In a real application, you would check authentication status here
  // If authenticated, redirect to dashboard, otherwise to login
  // For now, we'll redirect to login
  redirect("/login");
}
