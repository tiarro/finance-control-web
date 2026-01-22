"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Title } from "@/components/ui/title";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const fetchDashboardData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          amount,
          categories!inner(type)
        `)
        .eq("user_id", userId);

      if (error) throw error;

      const transactions = data || [] as Array<{
        amount: number;
        categories: {
          type: string;
        };
      }>;
      const totalIncome = transactions
        .filter(t => t.categories.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpense = transactions
        .filter(t => t.categories.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = totalIncome - totalExpense;

      setDashboardData({
        totalIncome,
        totalExpense,
        balance,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

    useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      await fetchDashboardData(user.id);
    };

    checkUser();
  }, [router, fetchDashboardData, supabase.auth]);

  return (
    <div className="h-screen flex flex-col">
      <div className={styles.topHeight}>
        <Title label="Dashboard" size="md" as="h2" />
        <p className="text-gray-600 text-sm mt-2">
          Pantau ringkasan saldo dan pengeluaranmu.
        </p>

        <div className={styles.statsGrid}>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
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
            </>
          )}
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
