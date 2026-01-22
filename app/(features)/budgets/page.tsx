"use client";

import { useCallback, useEffect, useState } from "react";
import { Title } from "@/components/ui/title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progress-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import styles from "./Budgets.module.css";
import { createClient } from "@/utils/supabase/client";

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  month: number;
  year: number;
  spent: number; // Calculated from transactions
  // Joined from categories table
  categories: {
    id: string;
    name: string;
    group_name: string;
    type: "income" | "expense";
  };
}

export default function BudgetsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    limit_amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [categories, setCategories] = useState<{
    id: string;
    name: string;
    group_name: string;
    type: "income" | "expense";
  }[]>([]);

  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    budgetId: string | null;
    budgetCategory: string;
  }>({
    isOpen: false,
    budgetId: null,
    budgetCategory: "",
  });

  useEffect(() => {
    const getUser = async () => {
      console.log("Getting user...");
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Auth error:", error);
      } else {
        console.log("User authenticated:", user);
      }
      
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const getBudgets = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get budgets with categories
      const { data: budgetsData, error: budgetsError } = await supabase
        .from("budgets")
        .select(`
          *,
          categories!inner(name, group_name, type)
        `)
        .eq("user_id", user.id)
        .order("month", { ascending: false })
        .order("year", { ascending: false });

      if (budgetsError) {
        console.error("Budgets error:", budgetsError);
        throw budgetsError;
      }

      // For each budget, calculate spent from transactions
      const budgetsWithSpent = await Promise.all(
        (budgetsData || []).map(async (budget) => {
          // Get transactions for this budget's category and time period
          const startDate = `${budget.year}-${String(budget.month).padStart(2, '0')}-01`;
          const endDate = `${budget.year}-${String(budget.month).padStart(2, '0')}-31`;
          
          const startDateTime = new Date(startDate).toISOString();
          const endDateTime = new Date(endDate).toISOString();
          
          const { data: transactionsData, error: transactionError } = await supabase
            .from("transactions")
            .select("amount")
            .eq("user_id", user.id)
            .eq("category_id", budget.category_id)
            .gte("transaction_date", startDateTime)
            .lt("transaction_date", endDateTime);

          if (transactionError) {
            console.error("Transaction query error:", transactionError);
            return {
              ...budget,
              spent: 0
            };
          }
          
          const spent = transactionsData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
          
          return {
            ...budget,
            spent
          };
        })
      );
      
      console.log("Budgets with spent:", budgetsWithSpent);
      setBudgets(budgetsWithSpent);
    } catch (error) {
      console.error("Error loading budgets:", error);
      
      // More specific error message
      if (error instanceof Error) {
        if (error.message.includes('relation "budgets" does not exist')) {
          alert("Tabel 'budgets' tidak ada. Silakan buat tabel di Supabase dashboard.");
        } else if (error.message.includes('permission denied')) {
          alert("Tidak memiliki akses ke tabel budgets. Periksa RLS policies.");
        } else {
          alert(`Gagal memuat data budget: ${error.message}`);
        }
      } else {
        alert("Gagal memuat data budget. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    // Load categories for dropdown
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    };
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    getBudgets();
  }, [user, getBudgets]);

  const handleEditBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setFormData({
        category_id: budget.category_id,
        limit_amount: budget.limit_amount.toString(),
        month: budget.month,
        year: budget.year,
      });
      setEditingBudget(budgetId);
    }
  };

  const handleDeleteBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setDeleteDialog({
        isOpen: true,
        budgetId: budgetId,
        budgetCategory: budget.categories.name,
      });
    }
  };

  const confirmDeleteBudget = async () => {
    if (!deleteDialog.budgetId || !user?.id) return;

    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", deleteDialog.budgetId)
        .eq("user_id", user.id);

      if (error) throw error;
      
      await getBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Gagal menghapus budget");
    }
    
    setDeleteDialog({
      isOpen: false,
      budgetId: null,
      budgetCategory: "",
    });
  };

  const cancelDeleteBudget = () => {
    setDeleteDialog({
      isOpen: false,
      budgetId: null,
      budgetCategory: "",
    });
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setFormData({
      category_id: "",
      limit_amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id || !formData.limit_amount || !user?.id) return;

    try {
      setLoading(true);
      
      if (editingBudget) {
        // Update existing budget
        const { data, error } = await supabase
          .from("budgets")
          .update({
            category_id: formData.category_id,
            limit_amount: parseFloat(formData.limit_amount),
            month: formData.month,
            year: formData.year,
          })
          .eq("id", editingBudget)
          .eq("user_id", user.id)
          .select(`
            *,
            categories!inner(name, group_name, type)
          `);

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("Updated budget:", data);
        setEditingBudget(null);
      } else {
        // Add new budget
        const { data, error } = await supabase
          .from("budgets")
          .insert({
            category_id: formData.category_id,
            limit_amount: parseFloat(formData.limit_amount),
            month: formData.month,
            year: formData.year,
            user_id: user.id,
          })
          .select(`
            *,
            categories!inner(name, group_name, type)
          `);

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        console.log("Created budget:", data);
      }

      await getBudgets();
      setFormData({ 
        category_id: "", 
        limit_amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error saving budget:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('relation "budgets" does not exist')) {
          alert("Tabel 'budgets' tidak ada. Silakan buat tabel di Supabase dashboard.");
        } else if (error.message.includes('permission denied')) {
          alert("Tidak memiliki akses ke tabel budgets. Periksa RLS policies.");
        } else {
          alert(`Gagal menyimpan budget: ${error.message}`);
        }
      } else {
        alert("Gagal menyimpan budget. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {/* Top Section - Budget Overview */}
      <div className={styles.budgetCard}>
        <Title label="Anggaran" size="md" as="h2" />
        <p className="text-gray-600 text-sm mt-3 mb-5">
          Catat setiap rupiah agar tidak ada yang terlewat.
        </p>

        {loading && budgets.length === 0 ? (
          <div className={styles.emptyState}>
            <Loader2 className={`${styles.emptyIcon} animate-spin`} />
            <div className={styles.emptyTitle}>Memuat budget...</div>
            <div className={styles.emptyDescription}>
              Mohon tunggu sebentar
            </div>
          </div>
        ) : budgets.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Belum ada budget yang diatur</p>
          </div>
        ) : (
          <div className="relative">
            {loading && budgets.length > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Memperbarui...</span>
                </div>
              </div>
            )}
            <div className={styles.budgetList}>
              {budgets.map((budget) => {
                const limitAmount = budget.limit_amount;
                const spent = budget.spent; // Now calculated from transactions
                const remaining = limitAmount - spent;
                const isExceeded = spent > limitAmount;

                return (
                  <div key={budget.id} className={styles.budgetItem}>
                    <div className={styles.budgetHeader}>
                      <span className={styles.budgetCategory}>
                        {budget.categories.name} ({budget.month}/{budget.year})
                      </span>
                      <div className={styles.budgetActions}>
                        <span className={styles.budgetAmount}>
                          Rp {limitAmount.toLocaleString("id-ID")}
                        </span>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEditBudget(budget.id)}
                            className={styles.editButton}
                            title="Edit Budget"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget.id)}
                            className={styles.deleteButton}
                            title="Hapus Budget"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.budgetProgress}>
                      <ProgressBar
                        value={spent}
                        max={limitAmount}
                        label=""
                      />
                    </div>

                    <div className={styles.budgetStats}>
                      <span className={styles.spent}>
                        Terpakai: Rp {spent.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={
                          isExceeded ? styles.exceeded : styles.remaining
                        }
                      >
                        {isExceeded
                          ? `Melebihi: Rp ${Math.abs(remaining).toLocaleString(
                              "id-ID"
                            )}`
                          : `Sisa: Rp ${remaining.toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Budget Form */}
        <div className={styles.formSection}>
          <Title
            label={editingBudget ? "Edit Budget" : "Atur Budget Baru"}
            size="md"
            as="h2"
            className="mb-5"
          />

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  className={styles.select}
                  value={formData.category_id}
                  onChange={(e) =>
                    handleInputChange("category_id", e.target.value)
                  }
                  required
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="amount">Jumlah Budget (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000000"
                  value={formData.limit_amount}
                  onChange={(e) => handleInputChange("limit_amount", e.target.value)}
                  required
                />
              </div>

              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="month">Bulan</Label>
                <select
                  id="month"
                  className={styles.select}
                  value={formData.month}
                  onChange={(e) => handleInputChange("month", e.target.value)}
                  required
                >
                  <option value="">Pilih bulan...</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((month) => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1, 1).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.formGroup} space-y-3`}>
                <Label htmlFor="year">Tahun</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  required
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <Button type="submit" size={"lg"} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingBudget ? "Mengupdate..." : "Menyimpan..."}
                  </>
                ) : (
                  <>{editingBudget ? "Update Budget" : "Atur Budget"}</>
                )}
              </Button>
              {editingBudget && (
                <Button
                  type="button"
                  variant="outline"
                  size={"lg"}
                  className="w-full"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && cancelDeleteBudget()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Budget</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus budget untuk kategori &quot;
              {deleteDialog.budgetCategory}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteBudget}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBudget}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
