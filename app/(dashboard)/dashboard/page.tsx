import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Keuangan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selamat datang di dashboard keuangan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Total Saldo
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Rp 0
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pengeluaran Bulan Ini
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            Rp 0
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pemasukan Bulan Ini
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            Rp 0
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Transaksi Terbaru
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Belum ada transaksi</p>
      </div>
    </div>
  );
}
