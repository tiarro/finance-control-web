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
import { formatRupiah } from "@/utils/format/formatRupiah";

interface Category {
  id: string;
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
      id: "",
      name: "",
      group_name: "",
      type: "income",
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    groupName: "",
  });
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);
  const [showBudgetWarning, setShowBudgetWarning] = useState<{
    isOpen: boolean;
    categoryName: string;
    budgetLimit: number;
  } | null>(null);

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
    // Set fixed transaction types for filter
    setTypes(["income", "expense"]);
  }, []);

  useEffect(() => {
    // Load semua kategori untuk dropdown
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    };
    fetchCategories();
  }, [supabase]);

  // Helper function to group categories by group_name
  const getGroupedCategories = (type?: "income" | "expense") => {
    const filteredCategories = type 
      ? categories.filter(cat => cat.type === type)
      : categories;
    
    const grouped = filteredCategories.reduce((acc, category) => {
      if (!acc[category.group_name]) {
        acc[category.group_name] = [];
      }
      acc[category.group_name].push(category);
      return acc;
    }, {} as Record<string, Category[]>);
    return grouped;
  };

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


  const checkBudgetExists = async (categoryId: string) => {
    if (!user?.id) return false;
    
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select("limit_amount")
        .eq("user_id", user.id)
        .eq("category_id", categoryId)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .single();
      
      return existingBudget ? existingBudget.limit_amount : null;
    } catch (error) {
      console.error("Error checking budget:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is logged in before adding transaction
    if (!user?.id) {
      setCategoryError("User tidak terautentikasi!");
      return;
    }

    // Add new transaction to database
    try {
      // Find category ID from selected category name
      const selectedCategory = categories.find(cat => cat.name === formData.categories.name);
      if (!selectedCategory) {
        setCategoryError("Kategori tidak ditemukan!");
        return;
      }

      // Check if budget exists for this category
      const budgetLimit = await checkBudgetExists(selectedCategory.id);
      
      if (!budgetLimit) {
        setShowBudgetWarning({
          isOpen: true,
          categoryName: selectedCategory.name,
          budgetLimit: 0
        });
        return;
      }

      const { data: newTransaction, error } = await supabase
        .from("transactions")
        .insert({
          amount: parseFloat(formData.amount),
          description: formData.description || null,
          transaction_date: formData.transactionDate,
          user_id: user.id, // Kolom: user_id (foreign key)
          category_id: selectedCategory.id,  // Kolom: category_id (foreign key) - use UUID instead of name
        })
        .select(`
          *,
          categories!inner(name, group_name, icon, color, type)
        `)
        .single();

      if (error) throw error;

      // Add to local state for immediate UI update
      setTransactions((prev) => [newTransaction, ...prev]);
      
      // Reset form
      setFormData({
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        description: "",
        categories: {
          id: "",
          name: "",
          group_name: "",
          type: "income",
        },
      });

      // Show success message
      setCategorySuccess("Transaksi berhasil ditambahkan!");
      setTimeout(() => setCategorySuccess(""), 3000);
      
    } catch (error) {
      console.error("Error adding transaction:", error);
      setCategoryError("Gagal menambahkan transaksi. Silakan coba lagi.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "categories.name") {
      if (value === "__ADD_NEW__") {
        // Show modal instead of prompt
        setShowAddCategoryModal(true);
        setNewCategoryForm({ name: "", groupName: "" });
        return;
      }
      
      // Find the selected category to get its group_name and id
      const selectedCategory = categories.find(cat => cat.name === value);
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          id: selectedCategory?.id || "",
          name: value,
          group_name: selectedCategory?.group_name || "",
        },
      }));
    } else if (field === "categories.type") {
      // Clear category selection when type changes
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          type: value as "income" | "expense",
          id: "",
          name: "",
          group_name: "",
        },
      }));
    } else if (field.startsWith("categories.")) {
      const categoryField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [categoryField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addNewCategory = async () => {
    const { name, groupName } = newCategoryForm;
    
    // Clear previous messages
    setCategoryError("");
    setCategorySuccess("");
    
    if (!name.trim() || !groupName.trim()) {
      setCategoryError("Nama kategori dan grup tidak boleh kosong!");
      return;
    }

    if (!user?.id) {
      setCategoryError("User tidak terautentikasi!");
      return;
    }

    try {
      // Check for duplicate category
      const { data: existingCategory } = await supabase
        .from("categories")
        .select("name")
        .eq("name", name.trim())  // Filter: nama = input user (tanpa spasi)
        .eq("user_id", user.id)   // Filter: user_id = user yang login
        .single();                // Mengambil satu data saja

      if (existingCategory) {
        setCategoryError(`Kategori "${name}" sudah ada!`);
        return;
      }

      // Insert new category
      const { data: newCategory, error } = await supabase
        .from("categories")
        .insert({
          name: name.trim(),
          group_name: groupName.trim(),
          type: formData.categories.type,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh categories list
      const { data: updatedCategories } = await supabase.from("categories").select("*");
      setCategories(updatedCategories || []);

      // Auto-select newly added category
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          name: newCategory.name,
          group_name: newCategory.group_name,
        },
      }));

      // Close modal and reset form
      setShowAddCategoryModal(false);
      setNewCategoryForm({ name: "", groupName: "" });
      setCategorySuccess(`Kategori "${name}" berhasil ditambahkan!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setCategorySuccess(""), 3000);
    } catch (error) {
      console.error("Error adding category:", error);
      setCategoryError("Gagal menambahkan kategori. Silakan coba lagi.");
    }
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
                {formData.categories.type === "income" && (
                  <option value="__ADD_NEW__">+ Tambah Kategori Baru</option>
                )}
                {Object.entries(getGroupedCategories(formData.categories.type)).map(([groupName, categoryList]) => (
                  <optgroup key={groupName} label={groupName}>
                    {categoryList.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
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
            !formData.categories.type || 
            !formData.categories.group_name || 
            !formData.description
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
                      {formatRupiah(transaction.amount)}
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

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Tambah Kategori Baru</h3>
            
            {/* Error Message */}
            {categoryError && (
              <div className="text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{categoryError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Nama Kategori</Label>
                <Input
                  id="categoryName"
                  type="text"
                  placeholder="Contoh: Freelance"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-3"
                />
              </div>
              
              <div>
                <Label htmlFor="groupName">Nama Grup</Label>
                <Input
                  id="groupName"
                  type="text"
                  placeholder="Contoh: Pemasukan Utama"
                  value={newCategoryForm.groupName}
                  onChange={(e) => setNewCategoryForm(prev => ({ ...prev, groupName: e.target.value }))}
                  className="mt-3"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setCategoryError("");
                  setNewCategoryForm({ name: "", groupName: "" });
                }}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={addNewCategory}
                className="flex-1"
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {categorySuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50 max-w-sm">
          <div className="flex items-center">
            <div className="flex shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{categorySuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Warning Modal */}
      {showBudgetWarning && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              ⚠️ Belum Ada Budget
            </h3>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Anda belum mengatur budget untuk kategori <strong>&quot;{showBudgetWarning.categoryName}&quot;</strong>.
              </p>
              <p className="text-gray-600 text-sm">
                Silakan buat budget terlebih dahulu di halaman <strong>Anggaran</strong> sebelum menambahkan transaksi.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBudgetWarning(null)}
                className="flex-1"
              >
                Mengerti
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowBudgetWarning(null);
                  // Redirect to budgets page
                  window.location.href = '/budgets';
                }}
                className="flex-1"
              >
                Buat Budget
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
