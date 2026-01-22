import type { Metadata } from "next";
import { Header } from "@/components/nav/header";
import { IncomeCheckProvider } from "@/contexts/income-check-context";
import { WarningDialog } from "@/components/warning-dialog";

export const metadata: Metadata = {
  title: "HematKuy",
  description: "Your personal finance dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you would check authentication status here
  // For now, we'll just render the children
  return (
    <IncomeCheckProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Header />
        <main className="container space-y-6">{children}</main>
        <WarningDialog />
      </div>
    </IncomeCheckProvider>
  );
}
