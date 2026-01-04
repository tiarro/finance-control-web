import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | HematKuy",
  description: "Login or create an account to access your financial dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      {children}
    </div>
  );
}