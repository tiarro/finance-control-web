import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            HematKuy
          </h1>
          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/transactions"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    Transaksi
                  </a>
                </li>
                <li>
                  <a
                    href="/reports"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    Laporan
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    Pengaturan
                  </a>
                </li>
              </ul>
            </nav>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
