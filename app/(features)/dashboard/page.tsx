"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Title } from "@/components/ui/title";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();

  // Mock data - replace with real data from your backend
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 5000000,
    totalExpense: 3500000,
    balance: 1500000,
  });

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="h-screen flex flex-col">
      <div className={styles.topHeight}>
        <Title label="Dashboard" size="md" as="h2" />
        <p className="text-gray-600 text-sm mt-2">
          Pantau ringkasan saldo dan pengeluaranmu.
        </p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Pemasukan</div>
            <div className={`${styles.statValue} ${styles.incomeValue}`}>
              Rp {dashboardData.totalIncome.toLocaleString("id-ID")}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Pengeluaran</div>
            <div className={`${styles.statValue} ${styles.expenseValue}`}>
              Rp {dashboardData.totalExpense.toLocaleString("id-ID")}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Saldo</div>
            <div
              className={`${styles.statValue} ${
                dashboardData.balance >= 0
                  ? styles.balancePositive
                  : styles.balanceNegative
              }`}
            >
              Rp {dashboardData.balance.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`container bg-white p-6 gap-4 rounded-lg flex flex-col justify-center items-center shadow border-2 ${styles.bottomHeight}`}
      >
        <LayoutDashboard size={48} className="text-blue-600 mb-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Selamat Datang!
        </h2>
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-gray-500 text-sm">
            Mulai kelola keuangan Anda dengan menambahkan transaksi pertama
          </p>
          <p className="text-gray-500 text-sm">
            Dashboard yang akan menampilkan ringkasan dan analisis lengkap.
          </p>
        </div>

        <Button size="lg" onClick={() => router.push("/transactions")}>
          Tambah Transaksi Pertama
        </Button>
      </div>
    </div>
  );
}
