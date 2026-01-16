"use client";

import { useCallback, useEffect, useState } from "react";
import { Title } from "@/components/ui/title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, TrendingDown, Calendar, Tag, Loader2 } from "lucide-react";
import styles from "./Transactions.module.css";
import { createClient } from "@/utils/supabase/client";
import { formatDateID } from "@/utils/format/formatDate";

interface Category {
  name: string;
  group_name: string;
  icon?: string;
  color?: string;
  type: "income" | "expense"; 
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  // Ini adalah hasil join dari Supabase
  categories: Category;
}

export default function TransactionsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState<{
    amount: string;
    transactionDate: string;
    description: string;
    categories: Category;
  }>({
    amount: "",
    transactionDate: new Date().toISOString().split("T")[0],
    description: "",
    categories: {
      name: "",
      group_name: "",
      type: "income",
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    // Load daftar grup saat komponen muncul
    const fetchTypes = async () => {
      const { data } = await supabase.from("categories").select("type");
      const uniqueTypes = Array.from(new Set(data?.map((i) => i.type)));
      setTypes(uniqueTypes as string[]);
    };
    fetchTypes();
  }, [supabase]);

const getTransactions = useCallback(async () => {
  if (!user?.id) return;

  try {
    setLoading(true);
    
    // 1. Inisialisasi query dasar
    let query = supabase
      .from("transactions")
      .select(`
        *,
        categories!inner(name, group_name, icon, color, type)
      `)
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false });

    // 2. Tambahkan filter tipe jika bukan "All"
    if (selectedType !== "All") {
      query = query.eq("categories.type", selectedType);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Simpan hasil langsung ke state transactions
    setTransactions(data || []);
  } catch (error) {
    console.error("Error loading transactions:", error);
    alert("Gagal memuat data transaksi");
  } finally {
    setLoading(false);
  }
}, [user, supabase, selectedType]); // selectedType harus ada di dependency agar fetch ulang saat filter berubah

  useEffect(() => {
    getTransactions();
  }, [user, getTransactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is logged in before adding transaction
    if (!user?.id) {
      alert("User not authenticated");
      return;
    }

    // Add new transaction to the list
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      description: formData.description || null,
      transaction_date: formData.transactionDate,
      user_id: user.id,
      created_at: new Date().toISOString(),
      categories: formData.categories,
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Reset form
    setFormData({
      amount: "",
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      categories: {
        name: "",
        group_name: "",
        type: "income",
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      salary: "Gaji",
      freelance: "Freelance",
      investment: "Investasi",
      "other-income": "Lainnya",
      food: "Makanan",
      transport: "Transport",
      entertainment: "Hiburan",
      bills: "Tagihan",
      shopping: "Belanja",
      "other-expense": "Lainnya",
    };
    return categories[category] || category;
  };

  return (
    <div className={styles.container}>
      {/* Top Section - Form */}
      <Title label="Transaksi" size="md" as="h2" />
      <p className="text-gray-600 text-sm mt-3 mb-5">
        Rencanakan belanja hari ini untuk kenyamanan esok hari.
      </p>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="type">Tipe</Label>
              <select
                id="type"
                className={styles.select}
                value={formData.categories.type}
                onChange={(e) => handleInputChange("categories.type", e.target.value)}
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className={styles.select}
                value={formData.categories.name}
                onChange={(e) => handleInputChange("categories.name", e.target.value)}
                required
              >
                <option value="">Pilih kategori...</option>
                {formData.categories.type === "income" ? (
                  <>
                    <option value="salary">Gaji</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investasi</option>
                    <option value="other-income">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="food">Makanan</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Hiburan</option>
                    <option value="bills">Tagihan</option>
                    <option value="shopping">Belanja</option>
                    <option value="other-expense">Lainnya</option>
                  </>
                )}
              </select>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.transactionDate}
                onChange={(e) =>
                  handleInputChange("transactionDate", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="description">Keterangan</Label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="Deskripsi transaksi"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <Button type="submit" size={"lg"} className="w-full mt-4" 
          disabled={
            !formData.amount || 
            !formData.transactionDate || 
            !formData.categories.name || 
            !formData.categories.type
          }>
            Tambah Transaksi
          </Button>
        </form>
      </div>

      {/* Bottom Section - Transaction History */}
      <div className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <Title label="Riwayat Transaksi" size="md" as="h2" />
          <div className="flex items-center gap-2">
            <Label htmlFor="filter">Filter:</Label>
            <select
              id="filter"
              className={styles.filterSelect}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">Semua Tipe</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "income" ? "Pemasukan" : "Pengeluaran"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <Loader2 className={`${styles.emptyIcon} animate-spin`} />
            <div className={styles.emptyTitle}>Memuat transaksi...</div>
            <div className={styles.emptyDescription}>
              Mohon tunggu sebentar
            </div>
          </div>
        ) : /* Empty State */
        transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <Wallet className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>Belum ada transaksi</div>
            <div className={styles.emptyDescription}>
              Tambahkan transaksi pertama Anda di atas
            </div>
          </div>
        ) : (
          <div className="relative">
            {loading && transactions.length > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Memperbarui...</span>
                </div>
              </div>
            )}
            <div className={styles.transactionList}>
              {transactions.map((transaction: Transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionIcon}>
                  {transaction.categories.type === "income" ? (
                    <TrendingUp className={styles.incomeIcon} />
                  ) : (
                    <TrendingDown className={styles.expenseIcon} />
                  )}
                </div>

                <div className={styles.transactionDetails}>
                  <div className={styles.transactionHeader}>
                    <div className={styles.transactionCategory}>
                      <Tag className={styles.categoryIcon} />
                      {getCategoryLabel(transaction.categories.name)}
                    </div>
                    <div
                      className={`${styles.transactionAmount} ${
                        transaction.categories.type === "income"
                          ? styles.incomeAmount
                          : styles.expenseAmount
                      }`}
                    >
                      {transaction.categories.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  <div className={styles.transactionMeta}>
                    <div className={styles.transactionDate}>
                      <Calendar className={styles.dateIcon} />
                      {formatDateID(transaction.transaction_date)}
                    </div>
                    {transaction.description && (
                      <div className={styles.transactionDescription}>
                        Keterangan : {transaction.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
