"use client";

import { useState, useMemo } from "react";
import { Title } from "@/components/ui/title";
import { Label } from "@/components/ui/label";
import DonutChart from "@/components/ui/donut-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { BarChart3 } from "lucide-react";
import styles from "./Reports.module.css";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string;
}

export default function ReportsPage() {
  // Mock data - replace with real data from your backend
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 5000000,
      category: "Gaji",
      date: "2026-01-01",
      description: "Gaji Januari",
    },
    {
      id: "2",
      type: "expense",
      amount: 1500000,
      category: "Makanan",
      date: "2026-01-02",
      description: "Groceries",
    },
    {
      id: "3",
      type: "expense",
      amount: 500000,
      category: "Transport",
      date: "2026-01-03",
      description: "Bensin",
    },
    {
      id: "4",
      type: "expense",
      amount: 800000,
      category: "Hiburan",
      date: "2026-01-04",
      description: "Nonton film",
    },
    {
      id: "5",
      type: "income",
      amount: 2000000,
      category: "Freelance",
      date: "2026-01-05",
      description: "Project web",
    },
    {
      id: "6",
      type: "expense",
      amount: 300000,
      category: "Tagihan",
      date: "2026-01-06",
      description: "Listrik",
    },
    {
      id: "7",
      type: "income",
      amount: 1500000,
      category: "Investasi",
      date: "2026-01-07",
      description: "Dividen saham",
    },
    {
      id: "8",
      type: "income",
      amount: 800000,
      category: "Bisnis",
      date: "2026-01-08",
      description: "Penjualan online",
    },
  ]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  // Prepare expense categories data for donut chart
  const expenseCategories = useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ];

    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  // Prepare income categories data for donut chart
  const incomeCategories = useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = [
      "#10b981",
      "#059669",
      "#047857",
      "#065f46",
      "#064e3b",
      "#0f766e",
      "#0d9488",
    ];

    return Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  // Prepare monthly trend data
  const monthlyTrend = useMemo(() => {
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString("id-ID", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }
      if (t.type === "income") {
        acc[month].income += t.amount;
      } else {
        acc[month].expense += t.amount;
      }
      return acc;
    }, {} as Record<string, { month: string; income: number; expense: number }>);

    return Object.values(monthlyData);
  }, [transactions]);

  // Prepare daily spending data for area chart
  const dailySpending = useMemo(() => {
    const dailyData = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const day = new Date(t.date).getDate();
        acc[day] = (acc[day] || 0) + t.amount;
        return acc;
      }, {} as Record<number, number>);

    return Array.from({ length: 7 }, (_, i) => ({
      day: `Hari ${i + 1}`,
      amount: dailyData[i + 1] || 0,
    }));
  }, [transactions]);

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className={styles.container}>
        <Title label="Laporan Keuangan" size="md" as="h2" className="mb-5" />
        <div className={styles.emptyState}>
          <BarChart3 className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>Belum Ada Data</div>
          <div className={styles.emptyDescription}>
            Tambahkan transaksi terlebih dahulu untuk melihat laporan keuangan
            lengkap Anda.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Section - Filters */}
      <Title label="Laporan" size="md" as="h2" />
      <p className="text-gray-600 text-sm mt-3 mb-5">
        Analisis kebiasaan finansialmu lewat grafik informatif.
      </p>
      {/* Bottom Section - Charts and Analytics */}
      <div className="mb-5">
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} bg-green-700`}>
            <div className={styles.summaryLabel}>Total Pemasukan</div>
            <div className={`${styles.summaryValue} ${styles.incomeValue}`}>
              Rp {summaryData.totalIncome.toLocaleString("id-ID")}
            </div>
          </div>
          <div className={`${styles.summaryCard} bg-red-700`}>
            <div className={styles.summaryLabel}>Total Pengeluaran</div>
            <div className={`${styles.summaryValue} ${styles.expenseValue}`}>
              Rp {summaryData.totalExpense.toLocaleString("id-ID")}
            </div>
          </div>
          <div className={`${styles.summaryCard} bg-blue-700`}>
            <div className={styles.summaryLabel}>Saldo</div>
            <div className={`${styles.summaryValue} ${styles.balanceValue}`}>
              Rp {summaryData.balance.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          {/* Donut Charts Row */}
          <div className={styles.donutChartsRow}>
            {/* Expense Categories Donut Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Pengeluaran per Kategori</div>
              <DonutChart data={expenseCategories} />
              <div className={styles.legendGrid}>
                {expenseCategories.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Categories Donut Chart */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Pemasukan per Kategori</div>
              <DonutChart data={incomeCategories} />
              <div className={styles.legendGrid}>
                {incomeCategories.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Spending Area Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Pengeluaran Harian</div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    `Rp ${(value || 0).toLocaleString("id-ID")}`,
                    "Pengeluaran",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expense Bar Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>
              Perbandingan Pemasukan vs Pengeluaran
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    `Rp ${(value || 0).toLocaleString("id-ID")}`,
                    "",
                  ]}
                />
                <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
